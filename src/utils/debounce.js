// Debounce utility to delay function execution
export const debounce = (fn, delay = 400) => {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delay);
  };
};

export default debounce;
