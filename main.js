const minerar_btn = document.getElementById("minerar-btn");
const hash_output = document.getElementById("hash-output");
const data_input = document.getElementById("data-input");
const nonce_output = document.getElementById("nonce-output");
const assinatura_input = document.getElementById("assinatura-input");

async function getSHA256(message) {
    let b = new TextEncoder().encode(message);  
    let hash = await crypto.subtle.digest('SHA-256', b);
    let hash_a  = Array.from(new Uint8Array(hash));
    let xhash = hash_a.map(b => b.toString(16).padStart(2, '0')).join('');
    return xhash;
}

minerar_btn.addEventListener("click", async (e) => {
    var nonce = -1;
    var hash = "";

    do {
        nonce += 1
        hash = await getSHA256(data_input.value+nonce.toString());
    } while (!hash.startsWith(assinatura_input.value))


    hash_output.value = hash;
    nonce_output.value = nonce.toString();

});