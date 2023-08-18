const displayNode = document.querySelector("#display");
const formNode = document.querySelector('#form');

// Inputs

const titreNode = document.querySelector('#titre');
const contenuNode = document.querySelector('#contenu');
const auteurNode = document.querySelector('#auteur');

let btnState = true;

const ENDPOINT = "http://localhost:8080"

function reset() {
    titreNode.value =""
    contenuNode.value =""
    auteurNode.value =""
}

function init() {
    fetch(ENDPOINT+"/articles")
    .then((reponse)=>reponse.json())
    .then((articles)=> {
        const ulNode = document.createElement("ul");
        displayNode.innerHTML="";
        displayNode.append(ulNode);
        
        
        for (const article of articles) {
            const liNode = document.createElement("li");
            liNode.innerText = `
                Titre : ${article.titre}
                Contenu : ${article.contenu}
                Auteur : ${article.auteur}
            `;  
            const buttonNode = document.createElement("button");
            buttonNode.setAttribute("value", article.id);
            buttonNode.innerText="Supprimer";
            buttonNode.onclick = supprimerArticle; 
            liNode.append(buttonNode);
            ulNode.append(liNode);
        }
})
}

function supprimerArticle(event) {
    const id = event.target.value;
    fetch(ENDPOINT+`/articles/${id}`,{method:"DELETE"})
    .then((response)=>{
        if(response.status==204) {
            event.target.parentNode.remove();
            console.log("l'article est supprimé")
        }
    })
}

function afficherForm(event) {
    if(btnState) {//afficher le formulaire
        displayNode.style = "display:none;";
        formNode.style ="display:block";
        event.target.innerText="Afficher liste";
        btnState=false;
    } else {// afficher la liste
        displayNode.style = "display:block;";
        formNode.style ="display:none";
        event.target.innerText="Ajouter un article";
        btnState=true;
        init()
    }        
    
}

/**
 * Requete POST (AJAX)
 */

function ajouterArticle(event) {
    const article = {
        titre: titreNode.value,
        contenu: contenuNode.value,
        auteur: auteurNode.value
    }
    
    fetch(ENDPOINT+"/articles",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(article)
    })
    .then((response)=> response.json())
    .then((article)=>{
        if(article.id>0){
            reset()
            console.log("Article a bien été ajouté");
        }
    })
}

//Afficher la liste
init()