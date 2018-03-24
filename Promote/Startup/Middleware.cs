using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;
using AppFunc = System.Func<System.Collections.Generic.IDictionary<string, object>, System.Threading.Tasks.Task>;

namespace Promote.Startup {
    public class PromoteMiddleware
    {
        private AppFunc _next;

        public void Initialize(AppFunc next)
        {
            _next = next;
        }

        public async Task Invoke(IDictionary<string, object> environment)
        {
            Debug.WriteLine("Begin executing request in custom middleware");
            await _next.Invoke(environment);
            Debug.WriteLine("End executing request in custom middleware");
        }
    }
}