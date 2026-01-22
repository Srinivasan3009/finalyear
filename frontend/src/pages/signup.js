import React,{useState} from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Register=()=>{
    const [formData, setFormData]= useState({
        username:"",
        email:"",
        password:""
    });
    const navigate=useNavigate();
    const handleChange=(e)=>{
        setFormData({...formData,[e.target.name]: e.target.value});
    }

    const handleSubmit= async (e)=>{
        e.preventDefault();
        try{
            const res=await axios.post("http://localhost:5000/users/register",formData);
            alert(res.data?.message || "Signup success");

            navigate("/");
        }catch(err){
            alert(err.response.data.message || "SignUp failed");
        }
    };
     return(
        <div style={styles.container }>
            <form style={styles.form} onSubmit={handleSubmit}>
                <h1>SignUp Here</h1>
                <input type='text' placeholder='Enter User Name'name='username' required style={styles.input} onChange={handleChange}/>
                <input type='email' placeholder='Enter Email'name='email' required style={styles.input} onChange={handleChange}/>
                <input type='password' placeholder='Enter Password' name='password' required style={styles.input} onChange={handleChange}/>
                <button type="submit" style={styles.button}>Submit</button>
                <p>Already have an Account? <Link to ="/">Login Here</Link></p>
            </form>
        </div>
     );
};

const styles={
    container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f2f2f2"
  },
  form: {
    background: "#fff",
    padding: "30px",
    borderRadius: "8px",
    width: "300px",
    display: "flex",
    flexDirection: "column"
  },
  input: {
    marginBottom: "15px",
    padding: "10px",
    fontSize: "16px"
  },
  button: {
    padding: "10px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "10px"
  }
};

export default Register;