// View Data page specific JavaScript
function toggleData(entryId) {
    const element = document.getElementById(entryId);
    const button = event.target.closest('button');
    
    if (element.style.display === 'none') {
        element.style.display = 'block';
        button.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Details';
    } else {
        element.style.display = 'none';
        button.innerHTML = '<i class="fas fa-eye"></i> View Details';
    }
}
