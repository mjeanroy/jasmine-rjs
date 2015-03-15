/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Mickael Jeanroy
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

describe('jasmine.rjs', function() {

  var ctx;

  beforeEach(function() {
    ctx = this;
  });

  describe('using global function', function() {
    var moduleA;

    beforeEach(rjs(['test/module-a'], function(_moduleA_) {
      moduleA = _moduleA_;
      expect(ctx).toBe(this);
    }));

    it('should load module A', function() {
      expect(moduleA).toBeDefined();
      expect(moduleA.name()).toBe('foo');
    });

    it('should load module B in test', rjs(['test/module-b'], function(moduleB) {
      expect(ctx).toBe(this);
      expect(moduleA).toBeDefined();
      expect(moduleB).toBeDefined();

      expect(moduleA.name()).toBe('foo');
      expect(moduleB.hello()).toBe('Hello foo');
    }));

    it('should load module using string as first parameter', rjs('test/module-b', function(moduleB) {
      expect(moduleB).toBeDefined();
      expect(moduleB.hello()).toBe('Hello foo');
    }));

    it('should load module using parameters name', rjs(function(moduleC) {
      expect(moduleC).toBeDefined();
      expect(moduleC.name()).toBe('bar');
    }));

    it('should load module using parameters name using pattern', rjs(function(_moduleC_) {
      expect(_moduleC_).toBeDefined();
      expect(_moduleC_.name()).toBe('bar');
    }));
  });

  describe('using jasmine function', function() {
    var moduleA;

    beforeEach(jasmine.rjs(['test/module-a'], function(_moduleA_) {
      moduleA = _moduleA_;
      expect(ctx).toBe(this);
    }));

    it('should load module A', function() {
      expect(moduleA).toBeDefined();
      expect(moduleA).toBeDefined();
    });

    it('should load module B in test', jasmine.rjs(['test/module-b'], function(moduleB) {
      expect(ctx).toBe(this);
      expect(moduleA).toBeDefined();
      expect(moduleB).toBeDefined();

      expect(moduleA).toBeDefined();
      expect(moduleB.hello()).toBe('Hello foo');
    }));

    it('should load module using string as first parameter', jasmine.rjs('test/module-b', function(moduleB) {
      expect(moduleB).toBeDefined();
      expect(moduleB.hello()).toBe('Hello foo');
    }));

    it('should load module using parameters name', jasmine.rjs(function(moduleC) {
      expect(moduleC).toBeDefined();
      expect(moduleC.name()).toBe('bar');
    }));

    it('should load module using parameters name using pattern', jasmine.rjs(function(_moduleC_) {
      expect(_moduleC_).toBeDefined();
      expect(_moduleC_.name()).toBe('bar');
    }));
  });
});