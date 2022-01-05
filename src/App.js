import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';

function App() {

const [data, setData]= UseState([]);
const [modalInsertar, setModalInsertar]=useState(false);
const [modalEditar, setModalEditar]=useState(false);
const [modalEliminar, setModalEliminar]=useState(false);
const baseUrl="https://localhost:44347/api/gestores";
const [gestorSeleccionado, setGestorSeleccionado]=useState({
  id: '',
  ciudad: '',
  pais: '',
  poblacion: ''
})

const handleChange=e=>{
  const {name, value}=e.target;
  setGestorSeleccionado({...gestorSeleccionado,[name]: value});
}

const abrirCerrarModalInsertar=()=>{
  setModalInsertar(!modalInsertar);
}
const abrirCerrarModalEditar=()=>{
  setModalEditar(!modalEditar);
}
const abrirCerrarModalEliminar=()=>{
  setModalEliminar(!modalEliminar);
}



const peticionGet=async()=>{
  await axios.get(baseUrl)
  .then(response=>{
    setData(response.data);
  }).catch(error=>{
    console.log(error);
  })
}

const peticionPost=async()=>{
  delete gestorSeleccionado.id;
  gestorSeleccionado.poblacion = parseInt(gestorSeleccionado.poblacion);
  await axios.post(baseUrl, gestorSeleccionado)
  .then(response=>{
    setData(data.concat(response.data));
    abrirCerrarModalInsertar();
  }).catch(error=>{
    console.log(error);
  })
}

const peticionPut=async()=>{
  gestorSeleccionado.poblacion = parseInt(gestorSeleccionado.poblacion);
  await axios.post(baseUrl+"/"+gestorSeleccionado.id, gestorSeleccionado)
  .then(response=>{
    var respuesta=response.data;
    var dataAuxiliar = data;
    dataAuxiliar.map(gestor=>{
      if (gestor.id===gestorSeleccionado.id){
        gestor.ciudad = respuesta.ciudad;
        gestor.pais= respuesta.pais;
        gestor.poblacion = respuesta.poblacion;
      }
    })
    abrirCerrarModalEditar();
  }).catch(error=>{
    console.log(error);
  })
}

const peticionDelete=async()=>{
  await axios.post(baseUrl+"/"+gestorSeleccionado.id)
  .then(response=>{
    setData(data.filter(gestor=>gestor.id!==response.data));
    abrirCerrarModalEliminar();
  }).catch(error=>{
    console.log(error);
  })
}

const seleccionarGestor=(gestor, caso)=>{
  setGestorSeleccionado(gestor);
  (caso==="Editar")?
  abrirCerrarModalEditar(): abrirCerrarModalEliminar();
}

useEffect(()=>{peticionGet();},[])

  return (
    <div className="App">
      <br /> <br />
      <button onClick={()=>abrirCerrarModalInsertar()} className="btn btn-success"> Insert new City</button>
      <br /> <br />
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>City</th>
            <th>Country</th>
            <th>Population</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(gestor=>(
            <tr key={gestor.id}>
              <td>{gestor.id}</td>
              <td>{gestor.ciudad}</td>
              <td>{gestor.pais}</td>
              <td>{gestor.poblacion}</td>
              <td>
                <button className="btn btn-primary" onClick={()=>seleccionarGestor(gestor, "Editar")}>Edit</button> {"  "}
                <button className="btn btn-danger" onClick={()=>seleccionarGestor(gestor, "Eliminar")}>Delete</button> {"  "}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalInsertar}>
        <ModalHeader>Insert Data</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label> City: </label>
            <br />
            <input type="text" className="form-control" name="ciudad" onchange={handleChange}/>
            <br />
            <label> Country: </label>
            <br />
            <input type="text" className="form-control" name="pais" onchange={handleChange}/>
            <br />
            <label> Population: </label>
            <br />
            <input type="text" className="form-control" name="poblacion" onchange={handleChange}/>
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={()=>peticionPost()}>Insert</button>{"  "}
          <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>Cancel</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Edit Data</ModalHeader>
        <ModalBody>
          <div className="form-group">
          <label> Id: </label>
            <br />
            <input type="text" className="form-control" name="id" readonly value={gestorSeleccionado && gestorSeleccionado.id}/>
            <br />
            <label> City: </label>
            <br />
            <input type="text" className="form-control" name="ciudad" onchange={handleChange} value={gestorSeleccionado && gestorSeleccionado.ciudad}/>
            <br />
            <label> Country: </label>
            <br />
            <input type="text" className="form-control" name="pais" onchange={handleChange} value={gestorSeleccionado && gestorSeleccionado.pais}/>
            <br />
            <label> Population: </label>
            <br />
            <input type="text" className="form-control" name="poblacion" onchange={handleChange} value={gestorSeleccionado && gestorSeleccionado.poblacion}/>
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={()=>peticionPut()}>Edit</button>{"  "}
          <button className="btn btn-danger" onClick={()=>abrirCerrarModalEditar()}>Cancel</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEliminar}>
        <ModalHeader>Delete Data</ModalHeader>
        <ModalBody> Are you sure to delete {gestorSeleccionado && gestorSeleccionado.ciudad}?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={()=>peticionDelete()}>Yes</button>
          <button className="btn btn-secondary" onClick={()=>abrirCerrarModalEliminar()}>No</button>{"  "}
        </ModalFooter>
      </Modal>
      
    </div>
  );
}

export default App;
