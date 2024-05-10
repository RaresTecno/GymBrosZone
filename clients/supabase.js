import { createClient } from '@supabase/supabase-js'
import { ref } from 'vue';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const userActive = ref(false);


export async function userData(){    
    const { data: { user } } = await supabase.auth.getUser();
}

export async function userState(){
    const currentUser = await supabase.auth.getSession();
    // console.log(currentUser)
    if (currentUser.data.session == null) {
        console.log("null")
        userActive.value = false;
    }else{
        console.log("No null")
        userActive.value = true;
    }
}

export async function seeCurrentUser() {
    const localUser = await supabase.auth.getSession();
    console.log(localUser);
}

export async function logOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.log(error);
    }else{
        console.log("Logged out");
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