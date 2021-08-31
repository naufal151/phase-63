const currentLocation = location.href;
let menuItem = select('.nav-button');
if(menuItem[i].href === currentLocation){
    menuItem[i].classList.add('active');
}