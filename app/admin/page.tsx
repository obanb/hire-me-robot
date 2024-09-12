import {AdminResend} from "../../components/Admin-resend";

const Home = async ({params: {hash}}: {params:{hash: string}}) => {
    console.log(hash)
    return (
        <div className="w-full flex h-full justify-start">
            <div className="w-2/4 ml-2"> {/* Adjust the margin-left as needed */}
                <AdminResend />
            </div>
        </div>
    )
}

export default Home
