const helpbtn = document.querySelector('#help');
const closebtn = document.querySelector('#close');

const main = () => {
  // help button
  helpbtn.addEventListener('click', () => {
    document.querySelector('#help-container').style.display = 'inline';
  });
  
  closebtn.addEventListener('click', () => {
    document.querySelector('#help-container').style.display = 'none';
  });
}

// RUN MAIN FUNCTION WHEN PAGE IS LOADED
window.onload = main;