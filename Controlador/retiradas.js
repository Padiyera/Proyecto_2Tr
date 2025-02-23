function getCookie(name) {
    let cookieArr = document.cookie.split(";");
    for (let i = 0; i < cookieArr.length; i++) {
      let cookiePair = cookieArr[i].split("=");
      if (name == cookiePair[0].trim()) {
        return decodeURIComponent(cookiePair[1]);
      }
    }
    return null;
  }
  
  var currentUser = getCookie('currentUser');
  console.log('Usuario actual:', currentUser);
  
  if (!currentUser) {
    // Redirigir al login si no hay usuario actual
    window.location.href = '../index.html';
  }