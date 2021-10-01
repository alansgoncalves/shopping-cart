// 5 - Some o valor total dos itens do carrinho de compras

const totalPrice = document.querySelector('.total-price');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// 3 - Remova o item do carrinho de compras ao clicar nele

function cartItemClickListener(event, keepItems, count, price) {
  localStorage.removeItem(`items${count}`);
  keepItems.removeChild(event.target);
  totalPrice.innerText = (Number(totalPrice.innerText) - Number(price)).toFixed(2); // 5: Função para subtrair valores
}

// 4 - Carregue o carrinho de compras através do LocalStorage ao iniciar a página

function createCartItemElement({ sku, name, price, image }) {
  const div = document.createElement('div');
  const ol = document.querySelector('.cart__items');
  div.className = 'cart__item';
  div.innerText = `${name} | PRICE: R$ ${price.toLocaleString('pt-BR')}`;
  localStorage.setItem(`items${ol.childElementCount}`, `${image}|${sku}|${name}|${price}`);
  const count = ol.childElementCount;

  div.addEventListener('click', (event) => 
    cartItemClickListener(event, ol, count, price));
  ol.appendChild(div);
  div.appendChild(createProductImageElement(image));
  totalPrice.innerText = (Number(totalPrice.innerText) + Number(price)).toFixed(2); // 5: Função para somar valores
}

// 2. Adicione o produto ao carrinho de compras

function createProductItemElement({ id: sku, title: name, thumbnail: image, price }) {
  const section = document.createElement('section');
  section.className = 'item';

  const getItems = document.querySelector('.items');

  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createCustomElement('p', 'prices_add', `R$ ${price.toLocaleString('pt-BR')}`)); // Valor do item a ser slecionado
  section.appendChild(createCustomElement('p', 'description', `em até 12x R$ ${(price / 12).toFixed(2).replace('.', ',')} 
  sem juros`));

  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', () => createCartItemElement({ image, name, price }));
  getItems.appendChild(section);
  return section;
}

// 1. Crie uma lista de produtos

const chargePage = async (param) => {
  const load = document.querySelector('.loading'); 
  const cart = document.querySelector('.cart');
  const items2 = document.querySelector('.items');
  items2.innerHTML = '';
  await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${param}`)
  .then((response) => response.json())
  .then((jsonBody) => jsonBody.results.forEach((value) => createProductItemElement(value)))
  .then(() => {
      cart.removeChild(load);
      for (let index = 0; index < localStorage.length; index += 1) {
        const [image, sku, name, price] = (localStorage.getItem(`items${index}`).split('|'));
        const objItem = { image, sku, name, price };
        createCartItemElement(objItem);
      }
    });
  };
  
  // 6 - Crie um botão para limpar carrinho de compras
  
  const removeButton = () => {
    const button = document.querySelector('.empty-cart');
    button.addEventListener('click', () => {
      document.querySelector('.cart__items').innerHTML = '';
      localStorage.clear();
      totalPrice.innerText = '0';
    });
  };

  const lupa = document.querySelector('.bx-search');
  const input = document.querySelector('#square2');

  lupa.addEventListener('click', () => {
    let input2 = input.value;
    chargePage(input2);
  });

  window.onload = function onload() {
    chargePage();
    removeButton();
    };