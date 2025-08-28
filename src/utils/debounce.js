// Debounce utility to delay function execution
export const debounce = (fn, delay = 400) => {
  let timerId;
  return (...args) => {
    if (typeof window !== 'undefined') {
      window.clearTimeout(timerId);
      timerId = window.setTimeout(() => fn(...args), delay);
    }
  };
};

export default debounce;
