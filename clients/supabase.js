import { createClient } from '@supabase/supabase-js'
import { ref } from 'vue';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const userActive = ref(false);
export const userId = ref();

/*Función para obtener el id del usuario.*/
export async function obtenerId() {
  const { data: { user }, error } = await supabase.auth.getUser();
  /*Cerramos la sesión del usuario en caso de error para que se repita el proceso.*/
  if (error) {
    logOut();
    return false;
  }
  userId.value = user.id;
  return user.id;
}

export async function userState(){
    const currentUser = await supabase.auth.getSession();
    if (currentUser.data.session == null) {
        userActive.value = false;
    }else{
        await obtenerId();
        userActive.value = true;
    }
}

export async function seeCurrentUser() {
    const localUser = await supabase.auth.getSession();
    return localUser.data.session.user
}

export async function logOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
    }else{
        window.location.href="/";
    }
    // export async function userState(event){
        
    // const { data } = supabase.auth.onAuthStateChange((event, session) => {
    //     userActive.value = true;
    
    //     if (event === 'INITIAL_SESSION') {
    //       // handle initial session
    //     } else if (event === 'SIGNED_IN') {
    //         userActive.value = true;
    //     } else if (event === 'SIGNED_OUT') {
    //       // handle sign out event
    //     } else if (event === 'PASSWORD_RECOVERY') {
    //       // handle password recovery event
    //     } else if (event === 'TOKEN_REFRESHED') {
    //       // handle token refreshed event
    //     } else if (event === 'USER_UPDATED') {
    //       // handle user updated event
    //     }
    //   })
      
    //   // call unsubscribe to remove the callback
    //   data.subscription.unsubscribe()
    // }
}