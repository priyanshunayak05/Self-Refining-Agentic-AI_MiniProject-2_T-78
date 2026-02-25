import Header from "./header";
import Left from "./left";
import Page from "./page";

const Dashboard = function(){
	return(
		<div className="w-full h-screen flex flex-col bg-slate-900">
			<div className="w-full h-full flex ">
				<Left/>
				<Page/>
			</div>
		</div>
	)
}

export default Dashboard;