// Code generated by mockery v2.43.2. DO NOT EDIT.

package mocks

import (
	context "context"

	mock "github.com/stretchr/testify/mock"
)

// HTTPRequestHandler is an autogenerated mock type for the HTTPRequestHandler type
type HTTPRequestHandler struct {
	mock.Mock
}

type HTTPRequestHandler_Expecter struct {
	mock *mock.Mock
}

func (_m *HTTPRequestHandler) EXPECT() *HTTPRequestHandler_Expecter {
	return &HTTPRequestHandler_Expecter{mock: &_m.Mock}
}

// ProcessRequest provides a mock function with given fields: ctx, rawRequest
func (_m *HTTPRequestHandler) ProcessRequest(ctx context.Context, rawRequest []byte) ([]byte, int) {
	ret := _m.Called(ctx, rawRequest)

	if len(ret) == 0 {
		panic("no return value specified for ProcessRequest")
	}

	var r0 []byte
	var r1 int
	if rf, ok := ret.Get(0).(func(context.Context, []byte) ([]byte, int)); ok {
		return rf(ctx, rawRequest)
	}
	if rf, ok := ret.Get(0).(func(context.Context, []byte) []byte); ok {
		r0 = rf(ctx, rawRequest)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).([]byte)
		}
	}

	if rf, ok := ret.Get(1).(func(context.Context, []byte) int); ok {
		r1 = rf(ctx, rawRequest)
	} else {
		r1 = ret.Get(1).(int)
	}

	return r0, r1
}

// HTTPRequestHandler_ProcessRequest_Call is a *mock.Call that shadows Run/Return methods with type explicit version for method 'ProcessRequest'
type HTTPRequestHandler_ProcessRequest_Call struct {
	*mock.Call
}

// ProcessRequest is a helper method to define mock.On call
//   - ctx context.Context
//   - rawRequest []byte
func (_e *HTTPRequestHandler_Expecter) ProcessRequest(ctx interface{}, rawRequest interface{}) *HTTPRequestHandler_ProcessRequest_Call {
	return &HTTPRequestHandler_ProcessRequest_Call{Call: _e.mock.On("ProcessRequest", ctx, rawRequest)}
}

func (_c *HTTPRequestHandler_ProcessRequest_Call) Run(run func(ctx context.Context, rawRequest []byte)) *HTTPRequestHandler_ProcessRequest_Call {
	_c.Call.Run(func(args mock.Arguments) {
		run(args[0].(context.Context), args[1].([]byte))
	})
	return _c
}

func (_c *HTTPRequestHandler_ProcessRequest_Call) Return(rawResponse []byte, httpStatusCode int) *HTTPRequestHandler_ProcessRequest_Call {
	_c.Call.Return(rawResponse, httpStatusCode)
	return _c
}

func (_c *HTTPRequestHandler_ProcessRequest_Call) RunAndReturn(run func(context.Context, []byte) ([]byte, int)) *HTTPRequestHandler_ProcessRequest_Call {
	_c.Call.Return(run)
	return _c
}

// NewHTTPRequestHandler creates a new instance of HTTPRequestHandler. It also registers a testing interface on the mock and a cleanup function to assert the mocks expectations.
// The first argument is typically a *testing.T value.
func NewHTTPRequestHandler(t interface {
	mock.TestingT
	Cleanup(func())
}) *HTTPRequestHandler {
	mock := &HTTPRequestHandler{}
	mock.Mock.Test(t)

	t.Cleanup(func() { mock.AssertExpectations(t) })

	return mock
}