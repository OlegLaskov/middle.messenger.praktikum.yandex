import Form from ".";
import tmpl from './form.hbs';
import './form.scss';
import Spiner from '../spiner';
import { connect, saveUserDataToStore } from "../../utils/HOC";
import store, { Indexed } from "../../utils/store";
import userApi from "../../api/user-api";

class ProfileForm extends Form {

	componentDidMount(): void {
		saveUserDataToStore();
	}

	render(){
		console.log('ProfileForm render=', this.props, 'children=', this.children);
		if(this.props.loading){
			return (new Spiner()).render();
		}
		if(this.props.user){
			this.state.form = Object.assign(this.state.form, this.props.user, {id: undefined, avatar: undefined});
		}

		return this.compile(tmpl, this.props);
	}
}
function mapStateToProps(state: Indexed<unknown>){
	console.log('ProfileForm: mapStateToProps: state', state);
	
	return {
		loading: state.userLoading,
		user: state.user
	}
}
export default connect(ProfileForm, mapStateToProps);