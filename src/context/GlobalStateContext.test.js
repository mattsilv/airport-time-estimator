import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  GlobalStateProvider,
  useGlobalState,
  useGlobalDispatch,
  reducer,
} from "./GlobalStateContext";

describe("reducer", () => {
  it("sets leave time", () => {
    const state = reducer(
      { leaveTime: "00:00" },
      { type: "SET_LEAVE_TIME", payload: "10:00" }
    );
    expect(state.leaveTime).toBe("10:00");
  });

  it("resets leave time", () => {
    const state = reducer({ leaveTime: "10:00" }, { type: "RESET_LEAVE_TIME" });
    expect(state.leaveTime).toBe("");
  });

  it("throws for unknown action", () => {
    expect(() => reducer({}, { type: "UNKNOWN_ACTION" })).toThrow(
      "Unknown action: UNKNOWN_ACTION"
    );
  });
});

describe("GlobalStateProvider", () => {
  it("provides state and dispatch", () => {
    const TestComponent = () => {
      const state = useGlobalState();
      const dispatch = useGlobalDispatch();
      return (
        <div>
          <div>Leave time: {state.leaveTime}</div>
          <div>Dispatch: {typeof dispatch}</div>
        </div>
      );
    };

    render(
      <GlobalStateProvider>
        <TestComponent />
      </GlobalStateProvider>
    );

    expect(screen.getByText("Leave time: 00:00")).toBeInTheDocument();
    expect(screen.getByText("Dispatch: function")).toBeInTheDocument();
  });
});

describe("useGlobalState and useGlobalDispatch", () => {
  it("return state and dispatch", () => {
    const TestComponent = () => {
      const state = useGlobalState();
      const dispatch = useGlobalDispatch();
      return (
        <div>
          <div>Leave time: {state.leaveTime}</div>
          <div>Dispatch: {typeof dispatch}</div>
        </div>
      );
    };

    render(
      <GlobalStateProvider>
        <TestComponent />
      </GlobalStateProvider>
    );

    expect(screen.getByText("Leave time: 00:00")).toBeInTheDocument();
    expect(screen.getByText("Dispatch: function")).toBeInTheDocument();
  });
});
