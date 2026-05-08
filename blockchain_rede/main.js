const bloco_template = document.getElementById("bloco-template");
const minerar_btn = document.querySelectorAll(".minerar-btn");
const novo_bloco_btn = document.getElementById("novo-bloco-btn");

const assinatura = "faca";


const worker = new Worker('../worker.js', { type: 'module' });
worker.onerror = e => console.error(e.message);


function change_background_color(e, hash){
    ass_length = assinatura.length;
    color = hash.substring(ass_length, ass_length+6);

    e.style.backgroundColor = `#${color}`
    e.style.color = "#ffffff"
}


function check_chain(node_letter){
    last_block = parseInt(document.querySelector(`#novo-bloco-btn[data-row="${node_letter}"]`).dataset.col);
    curr_block = 0;
    
    while (++curr_block < last_block){
        hash_atual = document.querySelector(`.hash-output#${node_letter}${curr_block}`).value;
        hash_previa  = document.querySelector(`.previous-hash-output#${node_letter}${curr_block+1}`).value;

        if (hash_atual != hash_previa) {
            return 1;
        }
    }
    
    return 0;
}


var current_block;
var current_node;
function minerar(e){
    document.querySelectorAll('button').forEach(b => {
        b.disabled = true;
    });

    current_node  = e.currentTarget.id[0];
    current_block = parseInt(e.currentTarget.id.slice(1));

    any_previous_hash = document.querySelector(`#${current_node}${current_block-1} .hash-output`);
    if (any_previous_hash != null){
        document.querySelector(`#${current_node}${current_block} .previous-hash-output`).value = any_previous_hash.value;
        change_background_color(document.querySelector(`#${current_node}${current_block} .previous-hash-output`), any_previous_hash.value);
    }


    const dados = {
        previous_hash_value: document.querySelector(`#${current_node}${current_block} .previous-hash-output`).value,
        data_input: document.querySelector(`#${current_node}${current_block} .data-input`).value,
        assinatura: assinatura,
    }
    worker.postMessage(dados);
}

worker.onmessage = e => {
    const {hash, nonce} = e.data;

    document.querySelector(`#${current_node}${current_block} .hash-output`).value = hash;
    change_background_color(document.querySelector(`#${current_node}${current_block} .hash-output`), hash);
    document.querySelector(`#${current_node}${current_block} .nonce-output`).value = nonce.toString();

    document.querySelectorAll('button').forEach(b => {
        b.disabled = false;
    });

    document.getElementById(`${current_node}node`).dataset.broken = check_chain(current_node);
};



document.querySelectorAll("#novo-bloco-btn").forEach(b => {
    b.addEventListener('click', (e) => {
        const block_ltr = e.target.dataset.row;
        const block_num = parseInt(e.target.dataset.col);

        const previous_bloco_id = `${block_ltr}${block_num}`;
        const block_id = `${block_ltr}${block_num+1}`;

        e.target.setAttribute('data-col', block_num+1);

        const f = document.createDocumentFragment();
        const node = bloco_template.content.cloneNode(true);

        node.querySelector(".title").id = block_id;
        node.querySelector(".bloco").id = block_id;
        node.querySelector(".nonce-output").id = block_id;
        node.querySelector(".data-input").id = block_id;
        node.querySelector(".hash-output").id = block_id;
        node.querySelector(".previous-hash-output").id = block_id;
        node.querySelector(".minerar-btn").id = block_id;

        node.querySelector(".title").value = `Bloco #${block_id}` ;

        previous_hash = document.querySelector(`#${CSS.escape(previous_bloco_id)} .hash-output`).value;
        node.querySelector(".previous-hash-output").value = previous_hash;
        change_background_color(node.querySelector(".previous-hash-output"), previous_hash)

        node.querySelector(".minerar-btn").addEventListener('click', minerar);

        f.appendChild(node);
        b.before(f);
    });
})



minerar_btn.forEach( b => {
    b.addEventListener('click', minerar);
});