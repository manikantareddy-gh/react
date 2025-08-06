import { Link, useNavigate } from 'react-router-dom'

export default function Home() {
    const redirect = useNavigate();

    const handleChange =(event)=>{
        const selectR = event.target.value;
        if(selectR){
            redirect(selectR);
        }

    }
    return (
        // <div>

        //     {/* <a href='librarian'>Librarian</a>&nbsp;&nbsp;
        //     <a href='customer'>Customer</a> */}
        //     <Link to="/librarian">Librarian</Link>&nbsp;&nbsp;&nbsp;
        //     <Link to="/customer">Customer</Link>&nbsp;&nbsp;&nbsp;
        //     <Link to="/student">Student</Link>
        // </div>

        <div>
            <label>Role:</label>
            <select onChange={handleChange}>
                <option value="none"></option>
                <option value="/customer">Customer</option>
                <option value="/librarian">Librarian</option>
                <option value="/student">Student</option>
            </select>
        </div>
    )
}
