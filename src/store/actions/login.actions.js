import { login } from 'store/reducers/login.reducer.js'


const LoginActions = (data) => 
{
    return (dispatch) => 
    {        
        try 
        {
            dispatch(login(data));
        } catch (error) 
        {
            console.log(`une erreur est survenue`)
            console.log(error)
        }
    }
   
};

export { LoginActions };