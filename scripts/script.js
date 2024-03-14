var carrito = [];

function agregarProducto(id, producto, precio) {

  let indice = carrito.findIndex(c => c.id === id);

  if (indice === -1) {
    postJSON({
      id: id,
      producto: producto,
      precio: precio,
      cantidad: 1,
    });
  } else {
    carrito[indice].cantidad++;
    putJSON(carrito[indice]);
  }

  console.log(carrito);

  //actualizarTabla();
  enviarACarritoServidor(datos);

  // enviarACarritoServidor(carrito)
}

function actualizarTabla() {
  let tbody = document.getElementById('tbody');
  let total = 0;

  tbody.innerHTML = '';

  for (let item of carrito) {
    let fila = tbody.insertRow();

    let celdaProducto = fila.insertCell(0);
    let celdaCantidad = fila.insertCell(1);
    let celdaPrecio = fila.insertCell(2);
    let celdaBoton = fila.insertCell(3);

    celdaProducto.textContent = item.producto;
    celdaCantidad.textContent = item.cantidad;
    celdaPrecio.textContent = item.precio * item.cantidad;

    //BOTÓN
    let boton = document.createElement("button");
    boton.textContent = "Eliminar";
    boton.className = "btn btn-danger";
    celdaBoton.append(boton);

    boton.addEventListener('click', function () {
        deleteJSON(item.id)
    });
    /////

    total = total + item.precio * item.cantidad;
  }

  document.getElementById('total').innerHTML = total;
}

///////////GUARDAR//////////
async function postJSON(data) {
  try {
    const response = await fetch("http://localhost:3000/carrito", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("Success:", result);
    } catch (error) {
    console.error("Error:", error);
  }
}

//////////CARGAR/////////////
async function getJSON(data) {
  try {
    const response = await fetch("http://localhost:3000/carrito", {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("Success:", result);

    carrito=result
    actualizarTabla()

  } catch (error) {
    console.error("Error:", error);
  }
}

window.onload = (event) => {
  getJSON();
};


//////////ACTUALIZAR/////////////
async function putJSON(data) {
    try {
      const response = await fetch(`http://localhost:3000/carrito/${data.id}`, {
        method: "PUT", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      console.log("Success:", result);
      
  
    } catch (error) {
      console.error("Error:", error);
    }
  }

  //////////ELIMINAR/////////////
  async function deleteJSON(id) {
    // Encontrar el índice del producto en el carrito
    let indice = carrito.findIndex(c => c.id === id);
    if (indice !== -1) {
        try {
            // Alerta de confirmación antes de eliminar el producto
            const confirmacion = await Swal.fire({
                title: "¿Seguro deseas borrar este producto?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, borrar"
            });
 
            if (confirmacion.isConfirmed) {
                // Eliminar el producto del carrito
                carrito.splice(indice, 1);
                // Actualizar la tabla
                actualizarTabla();
 
                // Realizar una petición al servidor para eliminar el producto
                const response = await fetch(`http://localhost:3000/carrito/${id}`, {
                    method: "DELETE", // Método DELETE para eliminar el producto
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
 
                const result = await response.json();
                console.log("Success:", result);
 
                // Alerta de éxito
                Swal.fire({
                    title: "¡El producto fue borrado!",
                    icon: "success"
                });
            }
        } catch (error) {
            console.error("Error:", error);
            // Alerta de error
            Swal.fire({
                title: "Error!",
                text: "Ocurrio un error al borrar el producto.",
                icon: "error"
            });
        }
    }
}
