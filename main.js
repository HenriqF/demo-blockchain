const bloco_template = document.getElementById("bloco-template");
const minerar_btn = document.querySelectorAll(".minerar-btn");
const assinatura_input = document.getElementById("assinatura-input");
const novo_bloco_btn = document.getElementById("novo-bloco-btn");

var current_block_id = 1;

function change_background_color(e, hash){
    ass_length = assinatura_input.value.length;
    color = hash.substring(ass_length, ass_length+6);

    e.style.backgroundColor = `#${color}`
}

async function getSHA256(message) {
    let b = new TextEncoder().encode(message);  
    let hash = await crypto.subtle.digest('SHA-256', b);
    let hash_a  = Array.from(new Uint8Array(hash));
    let xhash = hash_a.map(b => b.toString(16).padStart(2, '0')).join('');
    return xhash;
}
async function minerar(e) {
    const current_block = e.currentTarget.id;

    any_previous_hash = document.querySelector(`#${CSS.escape(parseInt(current_block, 10)-1)} .hash-output`);
    if (any_previous_hash != null){
        document.querySelector(`#${CSS.escape(current_block)} .previous-hash-output`).value = any_previous_hash.value;
        change_background_color(document.querySelector(`#${CSS.escape(current_block)} .previous-hash-output`), any_previous_hash.value);
    }




    const previous_hash_value = document.querySelector(`#${CSS.escape(current_block)} .previous-hash-output`).value;
    const data_input = document.querySelector(`#${CSS.escape(current_block)} .data-input`).value;
    var nonce = -1;
    var hash = "";

    do {
        nonce += 1
        hash = await getSHA256(nonce.toString()+data_input+previous_hash_value);
    } while (!hash.startsWith(assinatura_input.value))

    document.querySelector(`#${CSS.escape(current_block)} .hash-output`).value = hash;
    change_background_color(document.querySelector(`#${CSS.escape(current_block)} .hash-output`), hash);

    document.querySelector(`#${CSS.escape(current_block)} .nonce-output`).value = nonce.toString();
}




novo_bloco_btn.addEventListener('click', (e) => {
    const previous_bloco_id = `${current_block_id++}`;
    const block_id = `${current_block_id}`;

    const f = document.createDocumentFragment();
    const node = bloco_template.content.cloneNode(true);

    node.querySelector(".bloco").id = block_id;
    node.querySelector(".nonce-output").id = block_id;
    node.querySelector(".data-input").id = block_id;
    node.querySelector(".hash-output").id = block_id;
    node.querySelector(".previous-hash-output").id = block_id;
    node.querySelector(".minerar-btn").id = block_id;

    previous_hash = document.querySelector(`#${CSS.escape(previous_bloco_id)} .hash-output`).value;
    node.querySelector(".previous-hash-output").value = previous_hash;
    change_background_color(node.querySelector(".previous-hash-output"), previous_hash)

    node.querySelector(".minerar-btn").addEventListener('click', minerar);

    f.appendChild(node);
    f.append(document.createElement('br'), document.createElement('br'));
    novo_bloco_btn.before(f);
});

minerar_btn.forEach( b => {
    b.addEventListener('click', minerar);
});