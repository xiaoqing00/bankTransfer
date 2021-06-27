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
using System.Web.Http.Description;
using TranserApi.Models;

namespace TranserApi.Controllers
{
    public class AccountsController : ApiController
    {
        private BankEntities db = new BankEntities();

        // GET: api/Accounts
        public IQueryable<Account> GetAccounts()
        {
            return db.Accounts;
        }

        //// GET: api/Accounts/5
        //[ResponseType(typeof(Account))]
        //public async Task<IHttpActionResult> GetAccount(string id)
        //{
        //    Account account = await db.Accounts.FindAsync(id);
        //    if (account == null)
        //    {
        //        return NotFound();
        //    }

        //    return Ok(account);
        //}

        // GET: api/Accounts/5
        [HttpGet]
        [Route("api/accounts/{userID}")]
        [ResponseType(typeof(Account))]
        public IHttpActionResult GetAccount(string userID)
        {
            List<Account> accountList = db.Accounts.Where(a => a.userID == userID || a.accountID == userID).OrderBy(a=>a.userID).ToList();
            
            if (accountList == null)
            {
                return NotFound();
            }

            return Ok(accountList);
        }

        // PUT: api/Accounts/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutAccount(string id, Account account)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != account.userID)
            {
                return BadRequest();
            }

            db.Entry(account).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AccountExists(id))
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

        // POST: api/Accounts
        [ResponseType(typeof(Account))]
        public async Task<IHttpActionResult> PostAccount(Account account)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Accounts.Add(account);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (AccountExists(account.userID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = account.userID }, account);
        }

        // DELETE: api/Accounts/5
        [ResponseType(typeof(Account))]
        public async Task<IHttpActionResult> DeleteAccount(string id)
        {
            Account account = await db.Accounts.FindAsync(id);
            if (account == null)
            {
                return NotFound();
            }

            db.Accounts.Remove(account);
            await db.SaveChangesAsync();

            return Ok(account);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool AccountExists(string id)
        {
            return db.Accounts.Count(e => e.userID == id) > 0;
        }
    }
}