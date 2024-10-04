import {AdminResend} from "../../components/Admin-resend";

const Home = async ({params: {hash}}: {params:{hash: string}}) => {
    return (
        <div className="w-full flex h-full justify-start">
            <div className="w-2/4 ml-2">
                <AdminResend />
            </div>
        </div>
    )
}

export default Home
