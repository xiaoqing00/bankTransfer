using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using TranserApi.Models;

namespace TranserApi.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class TransactionsController : ApiController
    {
        private BankEntities db = new BankEntities();

        // GET: api/Transactions
        public IQueryable<Transaction> GetTransactions()
        {
            return db.Transactions;
        }

        // GET: api/Transactions/5
        //[ResponseType(typeof(Transaction))]
        //public async Task<IHttpActionResult> GetTransaction(string id)
        //{
        //    Transaction transaction = await db.Transactions.FindAsync(id);
        //    if (transaction == null)
        //    {
        //        return NotFound();
        //    }

        //    return Ok(transaction);
        //}

        [HttpGet]
        [Route("api/transactions/{fromUserID}")]
        [ResponseType(typeof(Transaction))]
        public IHttpActionResult GetTransaction(string fromUserID)
        {
            List<Transaction> transactionList = db.Transactions.Where(a => a.fromUserID == fromUserID).ToList();

            if (transactionList == null)
            {
                return NotFound();
            }

            return Ok(transactionList);
        }
        // PUT: api/Transactions/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutTransaction(string id, Transaction transaction)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != transaction.transactionID)
            {
                return BadRequest();
            }

            db.Entry(transaction).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TransactionExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Transactions
        [ResponseType(typeof(Transaction))]
        public async Task<IHttpActionResult> PostTransaction(Transaction transaction)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Transactions.Add(transaction);
            User user = await db.Users.FindAsync(transaction.fromUserID);
            if (transaction.type.Equals("topup"))
            {
                if (user.mainbalance > 0)
                {
                    user.mainbalance += transaction.amout;
                }
                else
                {
                    List<Account> accountList = db.Accounts.Where(a => a.userID == transaction.fromUserID).ToList();

                    if (accountList.Count == 0)
                    {
                        user.mainbalance += transaction.amout;
                    }
                    else
                    {
                        updateAccount(accountList, transaction, user);
                    }

                }
            }
            else if (transaction.type.Equals("transfer")) {
                if (user.mainbalance >= transaction.amout)
                {
                    user.mainbalance -= transaction.amout;
                    // update toUser mainbalance           
                    var toUser = await toUserAsync(transaction.toAccID);
                    if (toUser.mainbalance > 0)
                    {
                        toUser.mainbalance += transaction.amout;
                    }
                    else {
                        List<Account> accountList = db.Accounts.Where(a => a.userID == transaction.toAccID).ToList();
                        if (accountList.Count == 0)
                        {
                            toUser.mainbalance += transaction.amout;
                        }
                        else
                        {
                            updateAccount(accountList, transaction, toUser);
                        }
                    }
                }
                else { // owe money
                    List<Account> accountList = db.Accounts.Where(a => a.userID == transaction.fromUserID && a.accountName== transaction.toAccID).ToList();
                    if (accountList.Count == 0)
                    {
                        // create new account
                        Account newAcc = new Account();
                        newAcc.userID = user.userID;
                        newAcc.accountID = transaction.toAccID;
                        newAcc.accountName = transaction.toAccID;
                        newAcc.balance = user.mainbalance - transaction.amout;
                        newAcc.createDate = DateTime.Now;
                        db.Accounts.Add(newAcc);
                        user.mainbalance = 0;
                    }
                    else
                    {
                        // update account balance
                        foreach (Account acc in accountList)
                        { 
                        acc.balance += transaction.amout;
                            user.mainbalance = (user.mainbalance - transaction.amout) <= 0 ? 0 : user.mainbalance - transaction.amout;

                        }
                    }
                }               
            }
                try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (TransactionExists(transaction.transactionID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = transaction.transactionID }, transaction);
        }

        private void PostAccount()
        {
            throw new NotImplementedException();
        }

        // DELETE: api/Transactions/5
        [ResponseType(typeof(Transaction))]
        public async Task<IHttpActionResult> DeleteTransaction(string id)
        {
            Transaction transaction = await db.Transactions.FindAsync(id);
            if (transaction == null)
            {
                return NotFound();
            }

            db.Transactions.Remove(transaction);
            await db.SaveChangesAsync();

            return Ok(transaction);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TransactionExists(string id)
        {
            return db.Transactions.Count(e => e.transactionID == id) > 0;
        }

        private async Task<User> toUserAsync(string id)
        {
            User user = await db.Users.FindAsync(id);
            return user;
        }

        private void updateAccount(List<Account> accountList, Transaction transaction, User user) {
            decimal left = (decimal)transaction.amout;
            foreach (Account acc in accountList)
            {
                if (acc.balance < 0 && left > 0)
                {
                    Transaction t = new Transaction();
                    Random generator = new Random();
                    var initialBalance = acc.balance;
                    left = (decimal)(acc.balance + left);
                    acc.balance = left >= 0 ? 0 : left;

                    t.transactionID = generator.Next(0, 1000000).ToString("D10");
                    t.type = "transfer";
                    t.fromUserID = user.userID;
                    t.toAccID = acc.userID;
                    t.amout = left >= 0 ? (0 - initialBalance) : (left - initialBalance);
                    t.createDate = DateTime.Now;
                    t.status = left.ToString();
                    db.Transactions.Add(t);
                }
            }
            if (left > 0) user.mainbalance += left;
        }
    }
    
}