using forCrowd.Backbone.BusinessObjects.Entities;

namespace forCrowd.Backbone.WebApi.Controllers.Api
{
    using Microsoft.AspNet.Identity;
    using Microsoft.Owin.Security;
    using Models;
    using Results;
    using System;
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;

    public class AccountController : BaseApiController
    {
        private const string LocalLoginProvider = "Local";

        public AccountController()
        {
        }

        public AccountController(ISecureDataFormat<AuthenticationTicket> accessTokenFormat)
        {
            AccessTokenFormat = accessTokenFormat;
        }

        public ISecureDataFormat<AuthenticationTicket> AccessTokenFormat { get; private set; }

        // POST api/v1/Account/AddPassword
        public async Task<IHttpActionResult> AddPassword(AddPasswordBindingModel model)
        {
            var currentUserId = User.Identity.GetUserId<int>();
            var currentUser = await UserManager.FindByIdAsync(currentUserId);

            var result = await UserManager.AddPasswordAsync(currentUser.Id, model.Password);
            var errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return errorResult;
            }

            return Ok(currentUser);
        }

        // POST api/v1/Account/ChangeEmail
        public async Task<IHttpActionResult> ChangeEmail(ChangeEmailBindingModel model)
        {
            // Get the user
            var currentUserId = User.Identity.GetUserId<int>();
            var currentUser = await UserManager.FindByIdAsync(currentUserId);

            var result = await UserManager.SetEmailAsync(currentUser.Id, model.Email, model.ClientAppUrl);
            var errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return errorResult;
            }

            return Ok(currentUser);
        }

        // POST api/v1/Account/ChangePassword
        public async Task<IHttpActionResult> ChangePassword(ChangePasswordBindingModel model)
        {
            var currentUserId = User.Identity.GetUserId<int>();
            var currentUser = await UserManager.FindByIdAsync(currentUserId);

            var result = await UserManager.ChangePasswordAsync(currentUser.Id, model.CurrentPassword, model.NewPassword);
            var errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return errorResult;
            }

            return Ok(currentUser);
        }

        // POST api/v1/Account/ChangeUserName
        public async Task<IHttpActionResult> ChangeUserName(ChangeUserNameBindingModel model)
        {
            // Get the user
            var currentUserId = User.Identity.GetUserId<int>();
            var currentUser = await UserManager.FindByIdAsync(currentUserId);

            var result = await UserManager.ChangeUserName(currentUser.Id, model.UserName);
            var errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return errorResult;
            }

            return Ok(currentUser);
        }

        // POST api/v1/Account/ConfirmEmail
        public async Task<IHttpActionResult> ConfirmEmail(ConfirmEmailBindingModel model)
        {
            var currentUserId = User.Identity.GetUserId<int>();
            var currentUser = await UserManager.FindByIdAsync(currentUserId);

            var result = await UserManager.ConfirmEmailAsync(currentUser.Id, model.Token);
            var errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return errorResult;
            }

            return Ok(currentUser);
        }

        // GET api/v1/Account/CurrentUser
        [HttpGet]
        [AllowAnonymous]
        public async Task<User> CurrentUser()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return null;
            }

            var currentUserId = User.Identity.GetUserId<int>();

            return await UserManager.FindByIdAsync(currentUserId);
        }

        // DELETE api/v1/Account/DeleteAccount
        [HttpDelete]
        public async Task<IHttpActionResult> DeleteAccount()
        {
            var currentUserId = User.Identity.GetUserId<int>();
            var currentUser = await UserManager.FindByIdAsync(currentUserId);

            var result = await UserManager.DeleteAsync(currentUser);
            var errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return errorResult;
            }

            return Ok();
        }

        // POST api/v1/Account/Register
        [AllowAnonymous]
        public async Task<IHttpActionResult> Register(RegisterBindingModel model)
        {
            var user = new User(model.UserName, model.Email);

            var result = await UserManager.CreateUserAsync(user, model.Password, model.AutoGenerated, model.ClientAppUrl);
            var errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return errorResult;
            }

            // TODO This should be Created?
            return Ok(user);
        }

        // POST api/v1/Account/ResendConfirmationEmail
        public async Task<IHttpActionResult> ResendConfirmationEmail(ResendConfirmationEmailBindingModel model)
        {
            var currentUserId = User.Identity.GetUserId<int>();

            await UserManager.ResendConfirmationEmailAsync(currentUserId, model.ClientAppUrl);

            return StatusCode(HttpStatusCode.NoContent);
        }

        [AllowAnonymous]
        public async Task<IHttpActionResult> ResetPassword(ResetPasswordBindingModel model)
        {
            var currentUser = await UserManager.FindByEmailAsync(model.Email);
            var result = await UserManager.ResetPasswordAsync(currentUser.Id, model.Token, model.NewPassword);
            var errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return errorResult;
            }

            return Ok(currentUser);
        }

        [AllowAnonymous]
        public async Task<IHttpActionResult> ResetPasswordRequest(ResetPasswordRequestBindingModel model)
        {
            var currentUser = await UserManager.FindByEmailAsync(model.Email);

            if (currentUser == null)
            {
                return BadRequest("Incorrect email");
            }

            await UserManager.SendResetPasswordEmailAsync(currentUser.Id, model.ClientAppUrl);

            return StatusCode(HttpStatusCode.NoContent);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                UserManager.Dispose();
            }

            base.Dispose(disposing);
        }

        #region Helpers

        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError("Errors", error);
                    }
                }

                if (ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }

        #endregion
    }
}
