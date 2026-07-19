"use strict";
exports.id = "Source_Main_Keyboard_Keyboard_ts";
exports.ids = ["Source_Main_Keyboard_Keyboard_ts"];
exports.modules = {

/***/ "./Source/Main/Keyboard/Keyboard.ts"
/*!******************************************!*\
  !*** ./Source/Main/Keyboard/Keyboard.ts ***!
  \******************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      Keyboard.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2024 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Keyboard = void 0;
const NodeIpc_1 = __webpack_require__(/*! #/Event/NodeIpc */ "./Source/Main/Event/NodeIpc.ts");
const Shared_1 = __webpack_require__(/*! ../../Shared */ "./Source/Shared/index.ts");
const Event_1 = __webpack_require__(/*! #/Event */ "./Source/Main/Event/index.ts");
const Initialize_1 = __webpack_require__(/*! #/Initialize */ "./Source/Main/Initialize/index.ts");
class FKeyboard extends Event_1.TDispatcher_DEPRECATED {
    constructor() {
        super();
    }
    IsKeyDown = false;
    /** Returns true if the `OnKey` should continue. */
    Debounce = (State) => {
        if (State === "Down") {
            if (!this.IsKeyDown) {
                this.IsKeyDown = true;
                return true;
            }
            else {
                return false;
            }
        }
        else {
            this.IsKeyDown = false;
            return true;
        }
    };
    OnKey = (...Data) => {
        const Event = Data[0];
        const IsDebounced = this.Debounce(Event.State);
        if (IsDebounced && (0, Shared_1.IsVirtualKey)(Event.VkCode)) {
            this.Dispatch(Event);
        }
    };
}
exports.Keyboard = new FKeyboard();
async function InitializeKeyboard() {
    (0, NodeIpc_1.Subscribe)("Keyboard", exports.Keyboard.OnKey);
}
(0, Initialize_1.RegisterInitializationFunction)("Keyboard", InitializeKeyboard);


/***/ }

};
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291cmNlX01haW5fS2V5Ym9hcmRfS2V5Ym9hcmRfdHMuYnVuZGxlLmRldi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7R0FLRzs7O0FBR0gsK0ZBQTREO0FBQzVELHFGQUE0QztBQUM1QyxtRkFBaUQ7QUFDakQsa0dBQThEO0FBRTlELE1BQU0sU0FBVSxTQUFRLDhCQUFzQztJQUUxRDtRQUVJLEtBQUssRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVPLFNBQVMsR0FBWSxLQUFLLENBQUM7SUFFbkMsbURBQW1EO0lBQzNDLFFBQVEsR0FBRyxDQUFDLEtBQThCLEVBQVcsRUFBRTtRQUUzRCxJQUFJLEtBQUssS0FBSyxNQUFNLEVBQ3BCLENBQUM7WUFDRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFDbkIsQ0FBQztnQkFDRyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztnQkFDdEIsT0FBTyxJQUFJLENBQUM7WUFDaEIsQ0FBQztpQkFFRCxDQUFDO2dCQUNHLE9BQU8sS0FBSyxDQUFDO1lBQ2pCLENBQUM7UUFDTCxDQUFDO2FBRUQsQ0FBQztZQUNHLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1lBQ3ZCLE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7SUFDTCxDQUFDLENBQUM7SUFFSyxLQUFLLEdBQUcsQ0FBQyxHQUFHLElBQXFCLEVBQVEsRUFBRTtRQUU5QyxNQUFNLEtBQUssR0FBbUIsSUFBSSxDQUFDLENBQUMsQ0FBbUIsQ0FBQztRQUN4RCxNQUFNLFdBQVcsR0FBWSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4RCxJQUFJLFdBQVcsSUFBSSx5QkFBWSxFQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFDN0MsQ0FBQztZQUNHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekIsQ0FBQztJQUNMLENBQUMsQ0FBQztDQUNMO0FBRVksZ0JBQVEsR0FBYyxJQUFJLFNBQVMsRUFBRSxDQUFDO0FBRW5ELEtBQUssVUFBVSxrQkFBa0I7SUFFN0IsdUJBQVksRUFBQyxVQUFVLEVBQUUsZ0JBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM3QyxDQUFDO0FBRUQsK0NBQThCLEVBQUMsVUFBVSxFQUFFLGtCQUFrQixDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uL1NvdXJjZS9NYWluL0tleWJvYXJkL0tleWJvYXJkLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGUgICAgICBLZXlib2FyZC50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjQgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHsgRktleWJvYXJkRXZlbnQgfSBmcm9tIFwiLi9LZXlib2FyZC5UeXBlc1wiO1xuaW1wb3J0IHsgU3Vic2NyaWJlIGFzIElwY1N1YnNjcmliZSB9IGZyb20gXCIjL0V2ZW50L05vZGVJcGNcIjtcbmltcG9ydCB7IElzVmlydHVhbEtleSB9IGZyb20gXCIuLi8uLi9TaGFyZWRcIjtcbmltcG9ydCB7IFREaXNwYXRjaGVyX0RFUFJFQ0FURUQgfSBmcm9tIFwiIy9FdmVudFwiO1xuaW1wb3J0IHsgUmVnaXN0ZXJJbml0aWFsaXphdGlvbkZ1bmN0aW9uIH0gZnJvbSBcIiMvSW5pdGlhbGl6ZVwiO1xuXG5jbGFzcyBGS2V5Ym9hcmQgZXh0ZW5kcyBURGlzcGF0Y2hlcl9ERVBSRUNBVEVEPEZLZXlib2FyZEV2ZW50Plxue1xuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpXG4gICAge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIHByaXZhdGUgSXNLZXlEb3duOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICAvKiogUmV0dXJucyB0cnVlIGlmIHRoZSBgT25LZXlgIHNob3VsZCBjb250aW51ZS4gKi9cbiAgICBwcml2YXRlIERlYm91bmNlID0gKFN0YXRlOiBGS2V5Ym9hcmRFdmVudFtcIlN0YXRlXCJdKTogYm9vbGVhbiA9PlxuICAgIHtcbiAgICAgICAgaWYgKFN0YXRlID09PSBcIkRvd25cIilcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKCF0aGlzLklzS2V5RG93bilcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLklzS2V5RG93biA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5Jc0tleURvd24gPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHB1YmxpYyBPbktleSA9ICguLi5EYXRhOiBUQXJyYXk8dW5rbm93bj4pOiB2b2lkID0+XG4gICAge1xuICAgICAgICBjb25zdCBFdmVudDogRktleWJvYXJkRXZlbnQgPSBEYXRhWzBdIGFzIEZLZXlib2FyZEV2ZW50O1xuICAgICAgICBjb25zdCBJc0RlYm91bmNlZDogYm9vbGVhbiA9IHRoaXMuRGVib3VuY2UoRXZlbnQuU3RhdGUpO1xuICAgICAgICBpZiAoSXNEZWJvdW5jZWQgJiYgSXNWaXJ0dWFsS2V5KEV2ZW50LlZrQ29kZSkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuRGlzcGF0Y2goRXZlbnQpO1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuZXhwb3J0IGNvbnN0IEtleWJvYXJkOiBGS2V5Ym9hcmQgPSBuZXcgRktleWJvYXJkKCk7XG5cbmFzeW5jIGZ1bmN0aW9uIEluaXRpYWxpemVLZXlib2FyZCgpOiBQcm9taXNlPHZvaWQ+XG57XG4gICAgSXBjU3Vic2NyaWJlKFwiS2V5Ym9hcmRcIiwgS2V5Ym9hcmQuT25LZXkpO1xufVxuXG5SZWdpc3RlckluaXRpYWxpemF0aW9uRnVuY3Rpb24oXCJLZXlib2FyZFwiLCBJbml0aWFsaXplS2V5Ym9hcmQpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9