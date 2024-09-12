import ChatWindow from "../../../components/Chat";
import { useSession } from "next-auth/react";
import AvatarPresentation from "../../../components/Avatar-presentation";
import CompanyPresentation from "../../../components/Company-presentation";
import Footer from "../../../components/Footer"; // Import the Footer component

const Home = async ({ params: { hash } }) => {
    console.log(hash);
    return (
        <div className="w-full flex flex-col min-h-screen justify-between"> {/* Flex column layout to stack components */}
            <div className="flex h-full justify-start">
                <div className="w-[12%] ml-2 flex flex-col">
                    <div className="sticky top-0">
                        <CompanyPresentation />
                    </div>
                </div>
                <div className="w-2/4 ml-2 flex flex-col"> {/* Chat window container */}
                    <ChatWindow />
                </div>
                <div className="ml-2 flex flex-col"> {/* Avatar container */}
                    <div className="sticky top-0"> {/* Prevents AvatarPresentation from expanding */}
                        <AvatarPresentation />
                    </div>
                </div>
            </div>
            <Footer /> {/* Add the Footer component at the bottom */}
        </div>
    );
};

export default Home;