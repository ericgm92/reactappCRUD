import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';

function App() {

const [data, setData]= UseState([]);
const [modalInsert, setmodalInsert]=useState(false);
const [modalEdit, setmodalEdit]=useState(false);
const [modalDelete, setmodalDelete]=useState(false);
const baseUrl="https://localhost:44347/api/townes";
const [selectedTown, setselectedTown]=useState({
  id: '',
  name: '',
  country: '',
  population: ''
})

const handleChange=e=>{
  const {name, value}=e.target;
  setselectedTown({...selectedTown,[name]: value});
}

const openClosemodalInsert=()=>{
  setmodalInsert(!modalInsert);
}
const openClosemodalEdit=()=>{
  setmodalEdit(!modalEdit);
}
const openClosemodalDelete=()=>{
  setmodalDelete(!modalDelete);
}



const requestGet=async()=>{
  await axios.get(baseUrl)
  .then(response=>{
    setData(response.data);
  }).catch(error=>{
    console.log(error);
  })
}

const requestPost=async()=>{
  delete selectedTown.id;
  selectedTown.population = parseInt(selectedTown.population);
  await axios.post(baseUrl, selectedTown)
  .then(response=>{
    setData(data.concat(response.data));
    openClosemodalInsert();
  }).catch(error=>{
    console.log(error);
  })
}

const requestPut=async()=>{
  selectedTown.population = parseInt(selectedTown.population);
  await axios.post(baseUrl+"/"+selectedTown.id, selectedTown)
  .then(response=>{
    var answer=response.data;
    var dataAuxiliar = data;
    dataAuxiliar.map(town=>{
      if (town.id===selectedTown.id){
        town.name = answer.name;
        town.country= answer.country;
        town.population = answer.population;
      }
    })
    openClosemodalEdit();
  }).catch(error=>{
    console.log(error);
  })
}

const requestDelete=async()=>{
  await axios.post(baseUrl+"/"+selectedTown.id)
  .then(response=>{
    setData(data.filter(town=>town.id!==response.data));
    openClosemodalDelete();
  }).catch(error=>{
    console.log(error);
  })
}

const selecttown=(town, cases)=>{
  setselectedTown(town);
  (cases==="Edit")?
  openClosemodalEdit(): openClosemodalDelete();
}

useEffect(()=>{requestGet();},[])

  return (
    <div className="App">
      <br /> <br />
      <button onClick={()=>openClosemodalInsert()} className="btn btn-success"> Insert new City</button>
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
          {data.map(town=>(
            <tr key={town.id}>
              <td>{town.id}</td>
              <td>{town.name}</td>
              <td>{town.country}</td>
              <td>{town.population}</td>
              <td>
                <button className="btn btn-primary" onClick={()=>selecttown(town, "Edit")}>Edit</button> {"  "}
                <button className="btn btn-danger" onClick={()=>selecttown(town, "Delete")}>Delete</button> {"  "}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalInsert}>
        <ModalHeader>Insert Data</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label> City: </label>
            <br />
            <input type="text" className="form-control" name="name" onchange={handleChange}/>
            <br />
            <label> Country: </label>
            <br />
            <input type="text" className="form-control" name="country" onchange={handleChange}/>
            <br />
            <label> Population: </label>
            <br />
            <input type="text" className="form-control" name="population" onchange={handleChange}/>
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={()=>requestPost()}>Insert</button>{"  "}
          <button className="btn btn-danger" onClick={()=>openClosemodalInsert()}>Cancel</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEdit}>
        <ModalHeader>Edit Data</ModalHeader>
        <ModalBody>
          <div className="form-group">
          <label> Id: </label>
            <br />
            <input type="text" className="form-control" name="id" readonly value={selectedTown && selectedTown.id}/>
            <br />
            <label> City: </label>
            <br />
            <input type="text" className="form-control" name="name" onchange={handleChange} value={selectedTown && selectedTown.name}/>
            <br />
            <label> Country: </label>
            <br />
            <input type="text" className="form-control" name="country" onchange={handleChange} value={selectedTown && selectedTown.country}/>
            <br />
            <label> Population: </label>
            <br />
            <input type="text" className="form-control" name="population" onchange={handleChange} value={selectedTown && selectedTown.population}/>
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={()=>requestPut()}>Edit</button>{"  "}
          <button className="btn btn-danger" onClick={()=>openClosemodalEdit()}>Cancel</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalDelete}>
        <ModalHeader>Delete Data</ModalHeader>
        <ModalBody> Are you sure to delete {selectedTown && selectedTown.name}?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={()=>requestDelete()}>Yes</button>
          <button className="btn btn-secondary" onClick={()=>openClosemodalDelete()}>No</button>{"  "}
        </ModalFooter>
      </Modal>
      
    </div>
  );
}

export default App;
