export const isEmpty = (val) => {
  let empty = true;

  if (!val && val !== 0) {
    empty = true;
  }

  if (typeof val === 'number') {
    empty = false;
  }

  if (typeof val === 'string') {
    empty = !val.trim();
  }

  if (typeof val === 'object' && val) {
    empty = !Object.keys(val).length;
  }

  if (Array.isArray(val)) {
    empty = !val.length;
  }

  return empty;
};

export const isBoolean = (value) => (typeof value === 'boolean');
