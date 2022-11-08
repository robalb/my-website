(function(d, script) {
    script = d.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.onload = function(){
      // remote script has loaded
      axe
        .run()
        .then(results => {
          console.log({
            "passed": results.passes.length,
            "violations": results.violations.length
          });
          console.log(results)
        })
        .catch(err => {
          console.error('Something bad happened:', err.message);
        });
    };
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.5.1/axe.min.js';
    d.getElementsByTagName('head')[0].appendChild(script);
}(document));
