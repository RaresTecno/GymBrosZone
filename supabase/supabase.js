import { supabase } from './supabaseClient'
import { ref } from 'vue'

export async function createAcount(email, password) {
    const { data, error } = await supabase.auth.signUp({ 
        email: email, 
        password: password
})
if (error) {
    console.log(error);
}else{
    console.log(data);
}
}