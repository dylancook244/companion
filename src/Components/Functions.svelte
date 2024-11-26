
<script>
    // event bus, can emit and subscribe for events using it

    import { writable } from "svelte/store";
    
    const eventBus = writable({});

    export function emit(eventName, data) {
        eventBus.set({ name: eventName, payload: data});
    }

    export function subscribe(callback) {
        return eventBus.subscribe(callback);
    }


    

</script>
