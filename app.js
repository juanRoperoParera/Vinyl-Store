"use strict"

const mensaje = document.querySelector(".mensaje");

const contenedor_productos = document.querySelector(".productos");
const modal = document.querySelector(".modal");
const estados = document.querySelector(".estados");
const limite_maximo = document.querySelector(".valor-precio");
const precio = document.querySelector(".filtroPrecio");
const busqueda = document.querySelector(".busqueda");
const fechaInicial = document.querySelector(".fechaInicial");
const fechaFinal = document.querySelector(".fechaFinal");

const abrirCarrito = document.querySelector(".carritoBoton");

const carrito = document.querySelector(".cart-overlay");
const cerrar_carrito = document.querySelector(".cart-close");
const carrito_productos = document.querySelector(".cart-items");

const div_filtros = document.querySelector(".filtros");
const menuAbrir = document.querySelector(".menuAbrir");

const cerrarMenuFiltros = document.querySelector(".cerrar-menu-filtro");
const abrirMenuFiltros = document.querySelector(".aplicar");


abrirCarrito.addEventListener("click",
  () => {
    carrito.classList.add("show");
  });


cerrar_carrito.addEventListener("click",
  () => {
    carrito.classList.remove("show");
  });

precio.addEventListener("change",
  () => {
    let filtro;
    let limite = precio.value;
    //ACTUALIZAR EL LIMITE
    limite_maximo.innerText = "Precio maximo: " + limite+"€";

    //FILTRAR
    filtro = lista.filter(item => item.precio <= limite);

    //RENDERIZAR EL CONTENIDO
    if (filtro.length == 0) {
      contenedor_productos.innerHTML = `<h3 class='errorBusqueda'>
                                          No hay elementos que coincidan con tu búsqueda
                                      </h3>`;
    } else {
      renderizar(filtro, contenedor_productos, crearProducto);
    }
  });

fechaInicial.addEventListener("change",
  ()=>{
    let valorInicial=fechaInicial.value;
    let valorFinal=fechaFinal.value;

    console.log(valorInicial);
    console.log(valorFinal);
    let filtroFecha = lista.filter(item=>item.lanzamiento>=valorInicial && item.lanzamiento<=valorFinal);
    console.log(filtroFecha);
    if (filtroFecha.length == 0) {
      contenedor_productos.innerHTML = `<h3'>
                                          No hay elementos que coincidan con tu búsqueda
                                      </h3>`;
    } else {
      renderizar(filtroFecha, contenedor_productos, crearProducto);
    } 
  });

fechaFinal.addEventListener("change",
  ()=>{
    let valorInicial=fechaInicial.value;
    let valorFinal=fechaFinal.value;

    console.log(valorInicial);
    console.log(valorFinal);
    let filtroFecha = lista.filter(item=>item.lanzamiento>=valorInicial && item.lanzamiento<=valorFinal);
    console.log(filtroFecha);
    if (filtroFecha.length == 0) {
      contenedor_productos.innerHTML = `<h3'>
                                          No hay elementos que coincidan con tu búsqueda
                                      </h3>`;
    } else {
      renderizar(filtroFecha, contenedor_productos, crearProducto);
    } 
  });

Inicializar();
async function Inicializar(){
    renderizar(lista, contenedor_productos, crearProducto);
    /* ESTADOS */
    const lista_estados=lista.map(item=>item.categoria).filter((c,i,array)=>array.indexOf(c)===i);

    estados.innerHTML=`<button class='seleccionado'>todo</button>`;
    lista_estados.forEach(
    item=>{
        estados.innerHTML+=`<button>${item}</button>`;
    }
    )

    estados.addEventListener("click",
    (evento) => {
      const estado = estados.querySelectorAll("button");
      estado.forEach(item=>{
        item.classList.remove("seleccionado");
      })
      const activado = evento.target;

       lista_estados.forEach(
        item=>{
            activado.classList.add("seleccionado");
        }
        )


        
        let filtro;
        if(activado.innerText.toLowerCase() === "todo"){
            filtro = [...lista];
        }else{
            filtro = lista.filter(item=>item.categoria.toLowerCase()===activado.innerText.toLowerCase());
        }
        renderizar(filtro,contenedor_productos,crearProducto);
    })
    
    const maximo = Math.ceil(lista.map(item => item.precio).sort((a, b) => b - a)[0]);
    precio.setAttribute("max", maximo);
    precio.value = maximo;
    limite_maximo.innerText = "Precio maximo: " + maximo+"€";

    const actual = new Date();
    let año = actual.getFullYear();
    
    let mes = actual.getMonth()+1;
    let mesFormat = formatoFecha(mes);

    let dia = actual.getDay();
    let diaFormat = formatoFecha(dia);


    let fechaActual = `${año}-${mesFormat}-${diaFormat}`;
    fechaFinal.setAttribute("value",fechaActual);

    let fechaMasAntiguo = lista.map(item => item.lanzamiento).sort()[0]
    fechaInicial.setAttribute("value",fechaMasAntiguo);
}


/* CARRITO */
const vaciarCarro = document.querySelector(".vaciar");
const totalCarro = document.querySelector(".cart-total");
const checkoutCarro = document.querySelector(".checkout");


let lista_carrito = JSON.parse(localStorage.getItem("carrito") ?? "[]");

renderizar(lista_carrito,carrito_productos,crearItemCarrito);

let total=0;

if(lista_carrito.length>0){
  let total = 0;
  lista_carrito.forEach(
    p=>total+=p.precio
  );
  totalCarro.innerText=` total: ${localStorage.getItem("total")}€`;
}

vaciarCarro.addEventListener("click",
()=>{
  localStorage.clear();
  lista_carrito = [];
  total = 0;
  totalCarro.innerText=` total: ${total}€`;

  localStorage.setItem("total",total);
  renderizar(lista_carrito,carrito_productos,crearItemCarrito);
});

checkoutCarro.addEventListener("click",
()=>{
  localStorage.clear();
  lista_carrito = [];
  total = 0;
  totalCarro.innerText=` total: ${total}€`;

  localStorage.setItem("total",total);
  renderizar(lista_carrito,carrito_productos,crearItemCarrito);
})



/* BUSQUEDA */
busqueda.addEventListener("keyup",
()=>{
    let filtro;
    let texto_busqueda = busqueda.value.trim().toLowerCase();
    if (texto_busqueda === "") {
      filtro=[...lista];
    } else {
      filtro=lista.filter(item=> item.titulo.toLowerCase().includes(texto_busqueda) || item.precio==texto_busqueda);
    }
    //RENDERIZAR EL CONTENIDO EN FUNCION DEL FILTRO
    if(filtro.length==0){
      contenedor_productos.innerHTML=`<h3>No hay elementos con tu busqueda</h3>`;  
    }else{
      renderizar(filtro,contenedor_productos,crearProducto);
    }
});

function crearProducto(p) {
    const producto = document.createElement("article");
    producto.innerHTML = `
        <div>
            <img src="${p.image}" alt="${p.titulo}" />
        </div>
        <div>
            <h3>${p.titulo}</h3>
            <h3>${p.lanzamiento}</h4>
            <p>${p.precio} €</p>
            <i class="abrir fa-solid fa-eye"></i>
        </div>
        `;
        const modalAbrir = producto.querySelector(".abrir");
        modalAbrir.addEventListener("click",
        ()=>{
            modal.classList.add("open");
            modal.innerHTML=`
            <p class="mensaje">ㅤ</p>
            <div class="boton">
                <i class="fa-solid fa-circle-xmark cerrar"></i>
            </div> 
            <div class="contenido" data-key="${p.id}">
                <img src="${p.image}" alt="${p.titulo}" />
                <div>
                    <h3>${p.titulo}</h3>
                    <p>${p.lanzamiento}</p>
                    <p>${p.precio} €</p>
                    <i class="fa-solid fa-cart-shopping carrito"></i>
                </div>
            </div>
            `; 
            
            const cerrar_modal = modal.querySelector(".cerrar");
            cerrar_modal.addEventListener("click",
            ()=>{
                modal.classList.remove("open")
            });

            const carrito = modal.querySelector(".carrito");
            carrito.addEventListener('click',
                (evento) => {
                const contenedor_padre = evento.currentTarget.parentElement.parentElement;
                const id_producto = contenedor_padre.getAttribute("data-key");

                const buscado=lista.find(p=>p.id===id_producto);
                
                if(lista_carrito.includes(buscado)){

                }else{
                  buscado["unidades"]=1;
                  lista_carrito.push(buscado);

                  const nuevo_item_carrito=crearItemCarrito(p);
                  carrito_productos.appendChild(nuevo_item_carrito);
                  total+=buscado.precio;
                  totalCarro.innerText=` total: ${total}€`;

                  localStorage.setItem("total",total);
  
                  localStorage.setItem("carrito",JSON.stringify(lista_carrito));
                }
                });
            });
            
        
    return producto;
  }

function crearItemCarrito(p) {
  const nuevo_item = document.createElement('article');
  nuevo_item.classList.add('cart-item');
  nuevo_item.setAttribute('data-id', p.id);
  nuevo_item.innerHTML = `
      <img src="${p.image}"
                  class="cart-item-img"
                  alt="${p.titulo}"
              />  
              <div>
                  <h3 class="cart-item-name">${p.titulo}</h3>
                  <p class="cart-item-price">${p.precio}€</p>
                  <p class="cantidad">${p.unidades}</p>
                  <button class="subir">+</button><button class="bajar" data-key="${p.id}">-</button>
                  <button class="eliminar" data-key="${p.id}">Eliminar</button>
              </div>`;
  
  const eliminarCarro = nuevo_item.querySelector(".eliminar");
  const cantidad = nuevo_item.querySelector(".cantidad");
  const subirCarro = nuevo_item.querySelector(".subir");
  const bajarCarro = nuevo_item.querySelector(".bajar");

  subirCarro.addEventListener("click",
  ()=>{
    let numero=parseInt(cantidad.textContent);
    numero=numero+1;
    p["unidades"]=numero;
    cantidad.innerHTML=`<p class="cantidad">${numero}</p>`;
    total = total+p.precio;
    localStorage.setItem("total",total);

    totalCarro.innerHTML=`<p>Total: ${total}€</p>`;
  })

  bajarCarro.addEventListener("click",
  (evento)=>{
    let numero=parseInt(cantidad.textContent);
    numero=numero-1;
    p.unidades=numero;
    if(numero>0){
      cantidad.innerHTML=`<p class="cantidad">${numero}</p>`;
      total = total-p.precio;
      localStorage.setItem("total",total);

      totalCarro.innerHTML=`<p>Total: ${total}€</p>`;
    }else if(numero==0){
      total=total-p.precio;
      if(total<0){
        total=0;
      }
      totalCarro.innerHTML=`<p>Total: ${total}€</p>`;
      
      localStorage.setItem("total",total);

      let pulsado = evento.target;
      let idEliminar = eliminarCarro.getAttribute("data-key");
      lista_carrito = lista_carrito.filter(p=>p.id !== idEliminar);
      localStorage.removeItem("carrito",JSON.stringify(lista_carrito));
      renderizar(lista_carrito,carrito_productos,crearItemCarrito);
    }
    
  })

  eliminarCarro.addEventListener("click",
    (evento)=>{
    total=total-p.precio;
    if(total<0){
      total=0;
    }
    totalCarro.innerHTML=`<p>Total: ${total}€</p>`;
    
    localStorage.setItem("total",total);

    let pulsado = evento.target;
    let idEliminar = eliminarCarro.getAttribute("data-key");
    lista_carrito = lista_carrito.filter(p=>p.id !== idEliminar);
    localStorage.removeItem("carrito",JSON.stringify(lista_carrito));
    renderizar(lista_carrito,carrito_productos,crearItemCarrito);
}); 
  return nuevo_item;
}
 
function renderizar(lista_objetos, contenedor_dom, creador_dom) {
    contenedor_dom.innerHTML = "";

    lista_objetos.forEach(
      item => {
        const dom_item=creador_dom(item);
        contenedor_dom.appendChild(dom_item);                
    });
}

function mostrarMensaje(texto) {
  mensaje.innerHTML = `<h2>${texto}</h2>`;

  setTimeout(() => {
    mensaje.innerText = "";

  }, 2000);
}

function formatoFecha(fecha){
  if(fecha<10){
    fecha = "0"+fecha;
  }

  return fecha;
}


menuAbrir.addEventListener("click",()=>{
  div_filtros.classList.add("active");
})

cerrarMenuFiltros.addEventListener("click", ()=>{
  div_filtros.classList.remove("active");
})

abrirMenuFiltros.addEventListener("click",
()=>{
  div_filtros.classList.remove("active");
});



