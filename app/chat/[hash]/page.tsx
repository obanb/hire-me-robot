import ChatWindow from "../../../components/Chat";
import AvatarPresentation from "../../../components/Avatar-presentation";
import CompanyPresentation from "../../../components/Company-presentation";
import Footer from "../../../components/Footer";

const Home = async ({ params: { hash } }) => {
    console.log(hash);
    return (
        <div className="w-full flex flex-col min-h-screen justify-between">
            <div className="flex h-full justify-start">
                <div className="w-[12%] ml-2 flex flex-col">
                    <div className="sticky top-0">
                        <CompanyPresentation />
                    </div>
                </div>
                <div className="w-2/4 ml-2 flex flex-col">
                    <ChatWindow />
                </div>
                <div className="w-[12%] ml-2 flex flex-col">
                    <div className="sticky top-0">
                        <AvatarPresentation />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Home;