
export const phases = {
    IDLE: "IDLE",
    CHOOSE_LOST_OR_FOUND: "CHOOSE_LOST_OR_FOUND",
    ADD_LOST_MARKER: "ADD_NEW_LOST_MARKER",
    ADD_FOUND_MARKER : "ADD_NEW_FOUND_MARKER",
    ADD_KEPT_MARKER : "ADD_NEW_KEPT_MARKER",
}


export const marker_types = {//to choose marker imageee
    FOUND : "FOUND", 
    LOST : "LOST",
    KEPT_IDLE_PHASE: "KEPT_IDLE_PHASE",
    KPET_CHOOSE_PHASE : "KPET_CHOOSE_PHASE",
}


export const temp_marker_types = {
    TEMP_UNSET : "TEMP_UNSET",
    TEMP_FOUND : "TEMP_FOUND",
    TEMP_KEPT: "TEMP_KEPT",
    TEMP_LOST : "TEMP_LOST",
}