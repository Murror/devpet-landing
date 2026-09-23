// next/font/google is a build-time loader with no runtime under Jest.
// Each font function returns the same shape the real one does: a
// `variable` class name the layout interpolates into className.
module.exports = new Proxy(
  {},
  { get: () => () => ({ variable: 'mock-font-variable', className: 'mock-font' }) },
)
