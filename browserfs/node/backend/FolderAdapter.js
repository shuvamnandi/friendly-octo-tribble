"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var file_system_1 = require('../core/file_system');
var path = require('path');
var api_error_1 = require('../core/api_error');
var FolderAdapter = (function (_super) {
    __extends(FolderAdapter, _super);
    function FolderAdapter(folder, wrapped) {
        _super.call(this);
        this._folder = folder;
        this._wrapped = wrapped;
    }
    FolderAdapter.prototype.initialize = function (cb) {
        var _this = this;
        this._wrapped.exists(this._folder, function (exists) {
            if (exists) {
                cb();
            }
            else if (_this._wrapped.isReadOnly()) {
                cb(api_error_1.ApiError.ENOENT(_this._folder));
            }
            else {
                _this._wrapped.mkdir(_this._folder, 0x1ff, cb);
            }
        });
    };
    FolderAdapter.prototype.getName = function () { return this._wrapped.getName(); };
    FolderAdapter.prototype.isReadOnly = function () { return this._wrapped.isReadOnly(); };
    FolderAdapter.prototype.supportsProps = function () { return this._wrapped.supportsProps(); };
    FolderAdapter.prototype.supportsSynch = function () { return this._wrapped.supportsSynch(); };
    FolderAdapter.prototype.supportsLinks = function () { return false; };
    FolderAdapter.isAvailable = function () {
        return true;
    };
    return FolderAdapter;
}(file_system_1.BaseFileSystem));
exports.__esModule = true;
exports["default"] = FolderAdapter;
function translateError(folder, e) {
    if (e !== null && typeof e === 'object') {
        var err = e;
        var p = err.path;
        if (p) {
            p = '/' + path.relative(folder, p);
            err.message = err.message.replace(err.path, p);
            err.path = p;
        }
    }
    return e;
}
function wrapCallback(folder, cb) {
    if (typeof cb === 'function') {
        return function (err) {
            if (arguments.length > 0) {
                arguments[0] = translateError(folder, err);
            }
            cb.apply(null, arguments);
        };
    }
    else {
        return cb;
    }
}
function wrapFunction(name, wrapFirst, wrapSecond) {
    if (name.slice(name.length - 4) !== 'Sync') {
        return function () {
            if (arguments.length > 0) {
                if (wrapFirst) {
                    arguments[0] = path.join(this._folder, arguments[0]);
                }
                if (wrapSecond) {
                    arguments[1] = path.join(this._folder, arguments[1]);
                }
                arguments[arguments.length - 1] = wrapCallback(this._folder, arguments[arguments.length - 1]);
            }
            return this._wrapped[name].apply(this._wrapped, arguments);
        };
    }
    else {
        return function () {
            try {
                if (wrapFirst) {
                    arguments[0] = path.join(this._folder, arguments[0]);
                }
                if (wrapSecond) {
                    arguments[1] = path.join(this._folder, arguments[1]);
                }
                return this._wrapped[name].apply(this._wrapped, arguments);
            }
            catch (e) {
                throw translateError(this._folder, e);
            }
        };
    }
}
['diskSpace', 'stat', 'statSync', 'open', 'openSync', 'unlink', 'unlinkSync',
    'rmdir', 'rmdirSync', 'mkdir', 'mkdirSync', 'readdir', 'readdirSync', 'exists',
    'existsSync', 'realpath', 'realpathSync', 'truncate', 'truncateSync', 'readFile',
    'readFileSync', 'writeFile', 'writeFileSync', 'appendFile', 'appendFileSync',
    'chmod', 'chmodSync', 'chown', 'chownSync', 'utimes', 'utimeSync', 'readlink',
    'readlinkSync'].forEach(function (name) {
    FolderAdapter.prototype[name] = wrapFunction(name, true, false);
});
['rename', 'renameSync', 'link', 'linkSync', 'symlink', 'symlinkSync'].forEach(function (name) {
    FolderAdapter.prototype[name] = wrapFunction(name, true, true);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9sZGVyQWRhcHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9iYWNrZW5kL0ZvbGRlckFkYXB0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsNEJBQXlDLHFCQUFxQixDQUFDLENBQUE7QUFDL0QsSUFBTyxJQUFJLFdBQVcsTUFBTSxDQUFDLENBQUM7QUFDOUIsMEJBQXVCLG1CQUFtQixDQUFDLENBQUE7QUFLM0M7SUFBMkMsaUNBQWM7SUFHdkQsdUJBQVksTUFBYyxFQUFFLE9BQW1CO1FBQzdDLGlCQUFPLENBQUM7UUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztJQUMxQixDQUFDO0lBTU0sa0NBQVUsR0FBakIsVUFBa0IsRUFBMEI7UUFBNUMsaUJBVUM7UUFUQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFVBQUMsTUFBZTtZQUNqRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNYLEVBQUUsRUFBRSxDQUFDO1lBQ1AsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDdEMsRUFBRSxDQUFDLG9CQUFRLENBQUMsTUFBTSxDQUFDLEtBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixLQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztZQUMvQyxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU0sK0JBQU8sR0FBZCxjQUEyQixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FB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RSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLFlBQVk7SUFDM0UsT0FBTyxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsUUFBUTtJQUM5RSxZQUFZLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLFVBQVU7SUFDaEYsY0FBYyxFQUFFLFdBQVcsRUFBRSxlQUFlLEVBQUUsWUFBWSxFQUFFLGdCQUFnQjtJQUM1RSxPQUFPLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxVQUFVO0lBQzdFLGNBQWMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQVk7SUFDcEMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxZQUFZLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNsRSxDQUFDLENBQUMsQ0FBQztBQUdILENBQUMsUUFBUSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxhQUFhLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFZO0lBQzFGLGFBQWEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsWUFBWSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDakUsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0Jhc2VGaWxlU3lzdGVtLCBGaWxlU3lzdGVtfSBmcm9tICcuLi9jb3JlL2ZpbGVfc3lzdGVtJztcbmltcG9ydCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuaW1wb3J0IHtBcGlFcnJvcn0gZnJvbSAnLi4vY29yZS9hcGlfZXJyb3InO1xuXG4vKipcbiAqIFRoZSBGb2xkZXJBZGFwdGVyIGZpbGUgc3lzdGVtIHdyYXBzIGEgZmlsZSBzeXN0ZW0sIGFuZCBzY29wZXMgYWxsIGludGVyYWN0aW9ucyB0byBhIHN1YmZvbGRlciBvZiB0aGF0IGZpbGUgc3lzdGVtLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGb2xkZXJBZGFwdGVyIGV4dGVuZHMgQmFzZUZpbGVTeXN0ZW0gaW1wbGVtZW50cyBGaWxlU3lzdGVtIHtcbiAgcHJpdmF0ZSBfd3JhcHBlZDogRmlsZVN5c3RlbTtcbiAgcHJpdmF0ZSBfZm9sZGVyOiBzdHJpbmc7XG4gIGNvbnN0cnVjdG9yKGZvbGRlcjogc3RyaW5nLCB3cmFwcGVkOiBGaWxlU3lzdGVtKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9mb2xkZXIgPSBmb2xkZXI7XG4gICAgdGhpcy5fd3JhcHBlZCA9IHdyYXBwZWQ7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgZmlsZSBzeXN0ZW0uIEVuc3VyZXMgdGhhdCB0aGUgd3JhcHBlZCBmaWxlIHN5c3RlbVxuICAgKiBoYXMgdGhlIGdpdmVuIGZvbGRlci5cbiAgICovXG4gIHB1YmxpYyBpbml0aWFsaXplKGNiOiAoZT86IEFwaUVycm9yKSA9PiB2b2lkKSB7XG4gICAgdGhpcy5fd3JhcHBlZC5leGlzdHModGhpcy5fZm9sZGVyLCAoZXhpc3RzOiBib29sZWFuKSA9PiB7XG4gICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgIGNiKCk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX3dyYXBwZWQuaXNSZWFkT25seSgpKSB7XG4gICAgICAgIGNiKEFwaUVycm9yLkVOT0VOVCh0aGlzLl9mb2xkZXIpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3dyYXBwZWQubWtkaXIodGhpcy5fZm9sZGVyLCAweDFmZiwgY2IpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGdldE5hbWUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX3dyYXBwZWQuZ2V0TmFtZSgpOyB9XG4gIHB1YmxpYyBpc1JlYWRPbmx5KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fd3JhcHBlZC5pc1JlYWRPbmx5KCk7IH1cbiAgcHVibGljIHN1cHBvcnRzUHJvcHMoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl93cmFwcGVkLnN1cHBvcnRzUHJvcHMoKTsgfVxuICBwdWJsaWMgc3VwcG9ydHNTeW5jaCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX3dyYXBwZWQuc3VwcG9ydHNTeW5jaCgpOyB9XG4gIHB1YmxpYyBzdXBwb3J0c0xpbmtzKCk6IGJvb2xlYW4geyByZXR1cm4gZmFsc2U7IH1cblxuICBwdWJsaWMgc3RhdGljIGlzQXZhaWxhYmxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIHRyYW5zbGF0ZUVycm9yKGZvbGRlcjogc3RyaW5nLCBlOiBhbnkpOiBhbnkge1xuICBpZiAoZSAhPT0gbnVsbCAmJiB0eXBlb2YgZSA9PT0gJ29iamVjdCcpIHtcbiAgICBsZXQgZXJyID0gPEFwaUVycm9yPiBlO1xuICAgIGxldCBwID0gZXJyLnBhdGg7XG4gICAgaWYgKHApIHtcbiAgICAgIHAgPSAnLycgKyBwYXRoLnJlbGF0aXZlKGZvbGRlciwgcCk7XG4gICAgICBlcnIubWVzc2FnZSA9IGVyci5tZXNzYWdlLnJlcGxhY2UoZXJyLnBhdGgsIHApO1xuICAgICAgZXJyLnBhdGggPSBwO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZTtcbn1cblxuZnVuY3Rpb24gd3JhcENhbGxiYWNrKGZvbGRlcjogc3RyaW5nLCBjYjogYW55KTogYW55IHtcbiAgaWYgKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBmdW5jdGlvbihlcnIpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICBhcmd1bWVudHNbMF0gPSB0cmFuc2xhdGVFcnJvcihmb2xkZXIsIGVycik7XG4gICAgICB9XG4gICAgICAoPEZ1bmN0aW9uPiBjYikuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBjYjtcbiAgfVxufVxuXG5mdW5jdGlvbiB3cmFwRnVuY3Rpb24obmFtZTogc3RyaW5nLCB3cmFwRmlyc3Q6IGJvb2xlYW4sIHdyYXBTZWNvbmQ6IGJvb2xlYW4pOiBGdW5jdGlvbiB7XG4gIGlmIChuYW1lLnNsaWNlKG5hbWUubGVuZ3RoIC0gNCkgIT09ICdTeW5jJykge1xuICAgIC8vIEFzeW5jIGZ1bmN0aW9uLiBUcmFuc2xhdGUgZXJyb3IgaW4gY2FsbGJhY2suXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGlmICh3cmFwRmlyc3QpIHtcbiAgICAgICAgICBhcmd1bWVudHNbMF0gPSBwYXRoLmpvaW4odGhpcy5fZm9sZGVyLCBhcmd1bWVudHNbMF0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh3cmFwU2Vjb25kKSB7XG4gICAgICAgICAgYXJndW1lbnRzWzFdID0gcGF0aC5qb2luKHRoaXMuX2ZvbGRlciwgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgfVxuICAgICAgICBhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aCAtIDFdID0gd3JhcENhbGxiYWNrKHRoaXMuX2ZvbGRlciwgYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5fd3JhcHBlZFtuYW1lXS5hcHBseSh0aGlzLl93cmFwcGVkLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgLy8gU3luYyBmdW5jdGlvbi4gVHJhbnNsYXRlIGVycm9yIGluIGNhdGNoLlxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICh3cmFwRmlyc3QpIHtcbiAgICAgICAgICBhcmd1bWVudHNbMF0gPSBwYXRoLmpvaW4odGhpcy5fZm9sZGVyLCBhcmd1bWVudHNbMF0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh3cmFwU2Vjb25kKSB7XG4gICAgICAgICAgYXJndW1lbnRzWzFdID0gcGF0aC5qb2luKHRoaXMuX2ZvbGRlciwgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fd3JhcHBlZFtuYW1lXS5hcHBseSh0aGlzLl93cmFwcGVkLCBhcmd1bWVudHMpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0aHJvdyB0cmFuc2xhdGVFcnJvcih0aGlzLl9mb2xkZXIsIGUpO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn1cblxuLy8gRmlyc3QgYXJndW1lbnQgaXMgYSBwYXRoLlxuWydkaXNrU3BhY2UnLCAnc3RhdCcsICdzdGF0U3luYycsICdvcGVuJywgJ29wZW5TeW5jJywgJ3VubGluaycsICd1bmxpbmtTeW5jJyxcbiAncm1kaXInLCAncm1kaXJTeW5jJyAsJ21rZGlyJywgJ21rZGlyU3luYycsICdyZWFkZGlyJywgJ3JlYWRkaXJTeW5jJywgJ2V4aXN0cycsXG4gJ2V4aXN0c1N5bmMnLCAncmVhbHBhdGgnLCAncmVhbHBhdGhTeW5jJywgJ3RydW5jYXRlJywgJ3RydW5jYXRlU3luYycsICdyZWFkRmlsZScsXG4gJ3JlYWRGaWxlU3luYycsICd3cml0ZUZpbGUnLCAnd3JpdGVGaWxlU3luYycsICdhcHBlbmRGaWxlJywgJ2FwcGVuZEZpbGVTeW5jJyxcbiAnY2htb2QnLCAnY2htb2RTeW5jJywgJ2Nob3duJywgJ2Nob3duU3luYycsICd1dGltZXMnLCAndXRpbWVTeW5jJywgJ3JlYWRsaW5rJyxcbiAncmVhZGxpbmtTeW5jJ10uZm9yRWFjaCgobmFtZTogc3RyaW5nKSA9PiB7XG4gIEZvbGRlckFkYXB0ZXIucHJvdG90eXBlW25hbWVdID0gd3JhcEZ1bmN0aW9uKG5hbWUsIHRydWUsIGZhbHNlKTtcbn0pO1xuXG4vLyBGaXJzdCBhbmQgc2Vjb25kIGFyZ3VtZW50cyBhcmUgcGF0aHMuXG5bJ3JlbmFtZScsICdyZW5hbWVTeW5jJywgJ2xpbmsnLCAnbGlua1N5bmMnLCAnc3ltbGluaycsICdzeW1saW5rU3luYyddLmZvckVhY2goKG5hbWU6IHN0cmluZykgPT4ge1xuICBGb2xkZXJBZGFwdGVyLnByb3RvdHlwZVtuYW1lXSA9IHdyYXBGdW5jdGlvbihuYW1lLCB0cnVlLCB0cnVlKTtcbn0pO1xuIl19