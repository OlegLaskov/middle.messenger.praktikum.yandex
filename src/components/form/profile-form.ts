import Form from ".";
import tmpl from './form.hbs';
import './form.scss';
import Spiner from '../spiner';
import { connect } from "../../utils/HOC";
import { Indexed } from "../../utils/store";

class ProfileForm extends Form {

	render(){
		console.log('ProfileForm render=', this.props);
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
	return {
		loading: state.userLoading,
		user: state.user
	}
}
export default connect(ProfileForm, mapStateToProps);