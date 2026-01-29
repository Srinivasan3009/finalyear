import React,{useState} from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import {Link} from "react-router-dom";

const Login =()=>{

    const [formData, setFormData]=useState({
        email:"",
        password:""
    });
    const navigate=useNavigate();

    const handleChange=(e)=>{
        setFormData({...formData,[e.target.name]: e.target.value});
    };

    const handleSubmit= async (e)=>{
        e.preventDefault();
        try{
            const res=await axios.post("http://localhost:5000/users/login",formData);
             navigate("/chat");
            localStorage.setItem("username", res.user.username);
            localStorage.setItem("id",res.user.id);

        } catch (err) {
            console.log("Caught error:", err);

            if (err.response) {
            alert(err.response.data.message);
            } else {
            alert("JS error or navigation error");
        }}
    };

    return(
        <div style={styles.container}>
            
            <form style={styles.form} onSubmit={handleSubmit}>
                <h1>Login</h1>
                <input type='email' placeholder='Enter Email'name='email' required style={styles.input} onChange={handleChange}/>
                <input type='password' placeholder='Enter Password' name='password' required style={styles.input} onChange={handleChange}/>
                <button type="submit" style={styles.button}>Submit</button>
                <p>Don't have an Account? <Link to ="/register">signup Here</Link></p>
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
    background: "#28a745",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "10px"
  }
};

export default Login;