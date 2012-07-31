Api = require 'api'

describe 'Api', ->
  beforeEach ->
    @api = new Api 'http://localhost:3000'
  
  it 'should have an incrementing id', ->
    expect(@api.nextId()).toBe 'api-0'
    expect(@api.nextId()).toBe 'api-1'
  
  it 'should append a proxy frame', ->
    iframe = $('iframe')
    expect(iframe.length).toEqual 1
    expect(iframe).toHaveId 'api-proxy-frame'
    expect(iframe).toHaveAttr 'src', 'http://localhost:3000/proxy'
    expect(iframe).toBeHidden()
  
  it 'should accept requests', ->
    done = jasmine.createSpy()
    fail = jasmine.createSpy()
    @api.request 'getJSON', '/current_user', done, fail
    
    waitsFor ->
      done.wasCalled or fail.wasCalled
    
    runs ->
      expect(done).toHaveBeenCalled()
      expect(fail).not.toHaveBeenCalled()