const socket = io();

const productForm = document.querySelector('#productForm');
const productTitleInput = document.querySelector('#title');
const productPriceInput = document.querySelector('#price');
const productThumbnailInput =
  document.querySelector('#thumbnail');
const productsTable =
  document.querySelector('#productsList');

const chatForm = document.querySelector('.chat-form');
const chatMessageInput = chatForm.querySelector(
  '[name="message"]'
);
const chatEmailInput = chatForm.querySelector(
  '[name="email"]'
);
const messagesView = document.querySelector(
  '.chat-messages'
);

const productTemplate = Handlebars.compile(`
  {{#if productsExists}}
    <div class="bg-dark">
      <div class="row border-bottom">
        <div class="col-4 p-4 fw-bold">Nombre</div>
        <div class="col-4 p-4 fw-bold">Precio</div>
        <div class="col-4 p-4 fw-bold">Foto</div>
      </div>
      {{#each products}}
      <div class="row border-bottom">
        <div class="col-4 p-4">{{this.title}}</div>
        <div class="col-4 p-4">{{this.price}}</div>
        <div class="col-4 p-4">
          <img width="50" src="{{this.thumbnail}}" />
        </div>
      </div>
      {{/each}}
    </div>
  {{else}}
    <div class="alert alert-warning fw-bold" role="alert"> No se encontraron productos</div>
  {{/if}}
`);

const messagesTemplate = Handlebars.compile(`
  {{#if messagesExists}}
    {{#each messages}}
      <div class="message-item">
        <span class="author">{{this.author}}</span>
        <span>
          [<span class="date">{{this.date}}</span>]:
        </span>
        <span class="message">{{this.message}}</span>
      </div>
    {{/each}}
  {{/if}}
`);

function renderProducts(products = []) {
  const html = productTemplate({
    products,
    productsExists: products.length,
  });
  productsTable.innerHTML = html;
}

function renderMessages(messages = []) {
  const html = messagesTemplate({
    messages,
    messagesExists: !!messages.length,
  });
  messagesView.innerHTML = html;
  messagesView.scrollTop = messagesView.scrollHeight;
}

socket.on('products', renderProducts);

socket.on('messages', renderMessages);

productForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = productTitleInput.value;
  const price = productPriceInput.value;
  const thumbnail = productThumbnailInput.value;
  socket.emit('productAdd', { title, price, thumbnail });
  productForm.reset();
});

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = chatEmailInput.value;
  const message = chatMessageInput.value;
  socket.emit('message', { author: email, message });
  chatMessageInput.value = '';
});
