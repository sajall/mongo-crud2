
import './App.css';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form'
import  axios from 'axios';

axios.defaults.baseURL = "http://localhost:8080/"

function App() {

  // let {register , handleSubmit , reset} = useForm();
  // state for checking update 
  let [update , setUpdate] = useState({isEdit: false, id: ''});

  let [show , setShow] = useState(false);
  let {register , handleSubmit , reset } = useForm();
  let [users , setusers] = useState([]);
  function showForm(){
    setShow(true);
  }
  function closeForm(){
    setShow(false);
  }


  // user entered data handelsSubmit function
  const userData = async (data)=>{

     const formData= {
      name: data.name,
      email: data.email,
      mobile: data.mobile
    }
    console.log(formData , 'formdata');
   await  axios.post('/create' , data).then((resp)=>{ 
      console.log(resp, 'add user response');
      if(resp.status === 200){
        // recalling get userrs API
        callfunction()

      }

    })

    // updating user
  if(update.isEdit){
    axios.put(`/update/:${update.id}` , formData).then((resp)=>{
      console.log(resp.data);
    })
  }
   
  }

  // only one time getting users with useEffect
  useEffect(()=>{
    axios.get("/").then((resp)=>{
      console.log(resp.data , 'this is get response');
      setusers(resp.data.data);
    })
  } ,[]);

  // callFFunction after every othe rAPI call
  function callfunction(){
    axios.get("/").then((resp)=>{
      console.log(resp.data , 'this is get response');
      setusers(resp.data.data);
    })
  }

  // delete user 
const deleteUser = (id)=>{
  axios.delete('/delete/'+id).then((resp)=>{
    console.log(resp.data.message , 'this is delete response');
    if(resp.status === 200){
      callfunction();
    }
  });
  
}

// update user

// let [showuser , setShowuser] = useState({});

const updateUser = (id)=>{
// console.log(formData, 'formData');

  setShow(true);
  
setUpdate({isEdit: true, id: id});
  let userfind = users.find((user)=>user._id === id);
  console.log(userfind , 'user find ');


  reset({
    name:userfind.name,
    email: userfind.email,
    mobile : userfind.mobile
  });

  
}
// axios.put(`/update?id= ${id}` ).then((resp)=>{
//  await axios.put(`/update?id=${id}` ).then((resp)=>{
//   console.log(resp.data , 'data to update');
//   setShowuser(resp.data);
// })

// user jisko update krna hy uska data form mn dikhany k liy
// useEffect(()=>{
// } , [showuser]);


  return (
    <>
    <div >
      <button onClick={showForm}>Add</button>
{show ?
      <form action="" className= "App" onSubmit={handleSubmit(userData)}>

     <input {...register('name')} type="text" placeholder="name"/> <br />
     <input type="email" placeholder="email"  {...register('email')}/>  <br />

     <input type="number" placeholder="mobile number"  {...register('mobile')}/>

     <button>submit</button>
     <button onClick={closeForm}>close</button>
      </form>
     :null }
    </div>
    <div id='table'>
      <table border='1px'>
        <thead>
          <th>name</th>
          <th>eamil</th>
          <th>mobile number</th>
        </thead>
        {
          users.map((user)=>{
            return <tr>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.mobile}</td>
              <td>
                <button onClick={ 
                ()=>updateUser(user._id)
                }>Edit</button>
                <button   onClick={ 
                ()=>deleteUser(user._id)
                } >Delete</button>
              
              </td>
            </tr>
          })
        }
      </table>

    </div>
     </>
  );
}

export default App;
