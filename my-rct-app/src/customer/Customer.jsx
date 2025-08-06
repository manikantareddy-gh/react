import axios from 'axios';
import React from 'react'
import { useState, useEffect } from 'react';

export default function Customer() {
  const [books, setBooks] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // getBooks();
    updateStudentReq();
  }, [])
  
  async function updateStudentReq() {
    var data = {
      "studentId": "52",
      "bookIds": [50, 60]
    };
    let resp = await axios.post('api/student/request/add', data).then(rep => {
      console.log(rep);
    })
  }

  async function updateStudentRequest() {
    var data = {
      "studentId": "52",
      "bookIds": [30, 40]
    };
    let request = await  fetch('api/student/request/add',{
      method:'post',
      headers: {'Content-Type':'application/json'},
      body:JSON.stringify(data)
    }).then(resp=>{
      console.log(resp);
    });
  }

  


  async function getBooksWithAxios(){
    let response = await axios.get("/api/books").then(resp=>{
      if(resp.data?.status==='Success'){
        setBooks(resp.data?.data);
      }else{
        setErrorMsg(resp.data?.error_message);
      }
    })
  }



  async function getBooks() {
    let request = await fetch('/api/books');
    let response = await request.json();
    console.log(response.status === 'Success')
    if (response.status === 'Success') {
      setBooks([...response.data])
    } else {
      setErrorMsg(response['error_message']);
    }
  }

  if (errorMsg != '') {
    return (<table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{errorMsg}</td>
        </tr></tbody>
    </table>)
  } else {
    return (
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => (
            <tr key={index}>
              <td>{book.title}</td>
              <td>{book.author}</td>
            </tr>
          ))}</tbody>
      </table>
    )
  }
}
