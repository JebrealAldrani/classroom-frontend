import {useEffect} from "react";

const List = () => {
    useEffect(() => {
        const fetchApi = async () => {
            const res = await fetch('http://localhost:8000');
            console.log(res)
            return res.json()
        }
        const res = fetchApi();
    }, []);
    return (
        <div>Classes</div>
    )
}
export default List
