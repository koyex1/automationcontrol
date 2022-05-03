export const emptyValidator = (input) =>{
    if(!input){
        return true;
       // return false;

    }
     else if(input && input.trim()==false){
        return true;
        //return false;

     }
    else{
        return false;
    }
}