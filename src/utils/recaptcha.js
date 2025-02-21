export function loadRecaptcha() {
    return new Promise((resolve, reject) => {
      if (window.grecaptcha) {
        resolve(window.grecaptcha);
        return;
      }
  
      if (document.querySelector("script[src*='recaptcha/api.js']")) {
        resolve(window.grecaptcha);
        return;
      }
  
      const script = document.createElement("script");
      script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
      script.async = true;
      script.defer = true;
  
      script.onload = () => {
        if (window.grecaptcha) {
          resolve(window.grecaptcha);
        } else {
          reject(new Error("Error: reCAPTCHA no se cargó correctamente."));
        }
      };
  
      script.onerror = () => reject(new Error("Error: Fallo al cargar el script de reCAPTCHA."));
  
      document.head.appendChild(script);
    });
  }
  