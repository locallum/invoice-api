// popup functions
let popup = document.getElementById("popup");
        
document.getElementById('homeButton').addEventListener('click', function(event) {
    window.location.href = "/home";
});

document.getElementById('logoutButton').addEventListener('click', function(event) {
    popup.classList.add("open-popup");
});

function backtoLogin() {
    sessionStorage.clear();
    window.location.href = "/";
}

function stayonPage() {
    popup.classList.remove("open-popup");
}