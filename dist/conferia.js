(function () {
    'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol, Iterator */


    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    // these aren't really private, but nor are they really useful to document

    /**
     * @private
     */
    class LuxonError extends Error {}

    /**
     * @private
     */
    class InvalidDateTimeError extends LuxonError {
      constructor(reason) {
        super(`Invalid DateTime: ${reason.toMessage()}`);
      }
    }

    /**
     * @private
     */
    class InvalidIntervalError extends LuxonError {
      constructor(reason) {
        super(`Invalid Interval: ${reason.toMessage()}`);
      }
    }

    /**
     * @private
     */
    class InvalidDurationError extends LuxonError {
      constructor(reason) {
        super(`Invalid Duration: ${reason.toMessage()}`);
      }
    }

    /**
     * @private
     */
    class ConflictingSpecificationError extends LuxonError {}

    /**
     * @private
     */
    class InvalidUnitError extends LuxonError {
      constructor(unit) {
        super(`Invalid unit ${unit}`);
      }
    }

    /**
     * @private
     */
    class InvalidArgumentError extends LuxonError {}

    /**
     * @private
     */
    class ZoneIsAbstractError extends LuxonError {
      constructor() {
        super("Zone is an abstract class");
      }
    }

    /**
     * @private
     */

    const n = "numeric",
      s = "short",
      l = "long";

    const DATE_SHORT = {
      year: n,
      month: n,
      day: n,
    };

    const DATE_MED = {
      year: n,
      month: s,
      day: n,
    };

    const DATE_MED_WITH_WEEKDAY = {
      year: n,
      month: s,
      day: n,
      weekday: s,
    };

    const DATE_FULL = {
      year: n,
      month: l,
      day: n,
    };

    const DATE_HUGE = {
      year: n,
      month: l,
      day: n,
      weekday: l,
    };

    const TIME_SIMPLE = {
      hour: n,
      minute: n,
    };

    const TIME_WITH_SECONDS = {
      hour: n,
      minute: n,
      second: n,
    };

    const TIME_WITH_SHORT_OFFSET = {
      hour: n,
      minute: n,
      second: n,
      timeZoneName: s,
    };

    const TIME_WITH_LONG_OFFSET = {
      hour: n,
      minute: n,
      second: n,
      timeZoneName: l,
    };

    const TIME_24_SIMPLE = {
      hour: n,
      minute: n,
      hourCycle: "h23",
    };

    const TIME_24_WITH_SECONDS = {
      hour: n,
      minute: n,
      second: n,
      hourCycle: "h23",
    };

    const TIME_24_WITH_SHORT_OFFSET = {
      hour: n,
      minute: n,
      second: n,
      hourCycle: "h23",
      timeZoneName: s,
    };

    const TIME_24_WITH_LONG_OFFSET = {
      hour: n,
      minute: n,
      second: n,
      hourCycle: "h23",
      timeZoneName: l,
    };

    const DATETIME_SHORT = {
      year: n,
      month: n,
      day: n,
      hour: n,
      minute: n,
    };

    const DATETIME_SHORT_WITH_SECONDS = {
      year: n,
      month: n,
      day: n,
      hour: n,
      minute: n,
      second: n,
    };

    const DATETIME_MED = {
      year: n,
      month: s,
      day: n,
      hour: n,
      minute: n,
    };

    const DATETIME_MED_WITH_SECONDS = {
      year: n,
      month: s,
      day: n,
      hour: n,
      minute: n,
      second: n,
    };

    const DATETIME_MED_WITH_WEEKDAY = {
      year: n,
      month: s,
      day: n,
      weekday: s,
      hour: n,
      minute: n,
    };

    const DATETIME_FULL = {
      year: n,
      month: l,
      day: n,
      hour: n,
      minute: n,
      timeZoneName: s,
    };

    const DATETIME_FULL_WITH_SECONDS = {
      year: n,
      month: l,
      day: n,
      hour: n,
      minute: n,
      second: n,
      timeZoneName: s,
    };

    const DATETIME_HUGE = {
      year: n,
      month: l,
      day: n,
      weekday: l,
      hour: n,
      minute: n,
      timeZoneName: l,
    };

    const DATETIME_HUGE_WITH_SECONDS = {
      year: n,
      month: l,
      day: n,
      weekday: l,
      hour: n,
      minute: n,
      second: n,
      timeZoneName: l,
    };

    /**
     * @interface
     */
    class Zone {
      /**
       * The type of zone
       * @abstract
       * @type {string}
       */
      get type() {
        throw new ZoneIsAbstractError();
      }

      /**
       * The name of this zone.
       * @abstract
       * @type {string}
       */
      get name() {
        throw new ZoneIsAbstractError();
      }

      /**
       * The IANA name of this zone.
       * Defaults to `name` if not overwritten by a subclass.
       * @abstract
       * @type {string}
       */
      get ianaName() {
        return this.name;
      }

      /**
       * Returns whether the offset is known to be fixed for the whole year.
       * @abstract
       * @type {boolean}
       */
      get isUniversal() {
        throw new ZoneIsAbstractError();
      }

      /**
       * Returns the offset's common name (such as EST) at the specified timestamp
       * @abstract
       * @param {number} ts - Epoch milliseconds for which to get the name
       * @param {Object} opts - Options to affect the format
       * @param {string} opts.format - What style of offset to return. Accepts 'long' or 'short'.
       * @param {string} opts.locale - What locale to return the offset name in.
       * @return {string}
       */
      offsetName(ts, opts) {
        throw new ZoneIsAbstractError();
      }

      /**
       * Returns the offset's value as a string
       * @abstract
       * @param {number} ts - Epoch milliseconds for which to get the offset
       * @param {string} format - What style of offset to return.
       *                          Accepts 'narrow', 'short', or 'techie'. Returning '+6', '+06:00', or '+0600' respectively
       * @return {string}
       */
      formatOffset(ts, format) {
        throw new ZoneIsAbstractError();
      }

      /**
       * Return the offset in minutes for this zone at the specified timestamp.
       * @abstract
       * @param {number} ts - Epoch milliseconds for which to compute the offset
       * @return {number}
       */
      offset(ts) {
        throw new ZoneIsAbstractError();
      }

      /**
       * Return whether this Zone is equal to another zone
       * @abstract
       * @param {Zone} otherZone - the zone to compare
       * @return {boolean}
       */
      equals(otherZone) {
        throw new ZoneIsAbstractError();
      }

      /**
       * Return whether this Zone is valid.
       * @abstract
       * @type {boolean}
       */
      get isValid() {
        throw new ZoneIsAbstractError();
      }
    }

    let singleton$1 = null;

    /**
     * Represents the local zone for this JavaScript environment.
     * @implements {Zone}
     */
    class SystemZone extends Zone {
      /**
       * Get a singleton instance of the local zone
       * @return {SystemZone}
       */
      static get instance() {
        if (singleton$1 === null) {
          singleton$1 = new SystemZone();
        }
        return singleton$1;
      }

      /** @override **/
      get type() {
        return "system";
      }

      /** @override **/
      get name() {
        return new Intl.DateTimeFormat().resolvedOptions().timeZone;
      }

      /** @override **/
      get isUniversal() {
        return false;
      }

      /** @override **/
      offsetName(ts, { format, locale }) {
        return parseZoneInfo(ts, format, locale);
      }

      /** @override **/
      formatOffset(ts, format) {
        return formatOffset(this.offset(ts), format);
      }

      /** @override **/
      offset(ts) {
        return -new Date(ts).getTimezoneOffset();
      }

      /** @override **/
      equals(otherZone) {
        return otherZone.type === "system";
      }

      /** @override **/
      get isValid() {
        return true;
      }
    }

    let dtfCache = {};
    function makeDTF(zone) {
      if (!dtfCache[zone]) {
        dtfCache[zone] = new Intl.DateTimeFormat("en-US", {
          hour12: false,
          timeZone: zone,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          era: "short",
        });
      }
      return dtfCache[zone];
    }

    const typeToPos = {
      year: 0,
      month: 1,
      day: 2,
      era: 3,
      hour: 4,
      minute: 5,
      second: 6,
    };

    function hackyOffset(dtf, date) {
      const formatted = dtf.format(date).replace(/\u200E/g, ""),
        parsed = /(\d+)\/(\d+)\/(\d+) (AD|BC),? (\d+):(\d+):(\d+)/.exec(formatted),
        [, fMonth, fDay, fYear, fadOrBc, fHour, fMinute, fSecond] = parsed;
      return [fYear, fMonth, fDay, fadOrBc, fHour, fMinute, fSecond];
    }

    function partsOffset(dtf, date) {
      const formatted = dtf.formatToParts(date);
      const filled = [];
      for (let i = 0; i < formatted.length; i++) {
        const { type, value } = formatted[i];
        const pos = typeToPos[type];

        if (type === "era") {
          filled[pos] = value;
        } else if (!isUndefined(pos)) {
          filled[pos] = parseInt(value, 10);
        }
      }
      return filled;
    }

    let ianaZoneCache = {};
    /**
     * A zone identified by an IANA identifier, like America/New_York
     * @implements {Zone}
     */
    class IANAZone extends Zone {
      /**
       * @param {string} name - Zone name
       * @return {IANAZone}
       */
      static create(name) {
        if (!ianaZoneCache[name]) {
          ianaZoneCache[name] = new IANAZone(name);
        }
        return ianaZoneCache[name];
      }

      /**
       * Reset local caches. Should only be necessary in testing scenarios.
       * @return {void}
       */
      static resetCache() {
        ianaZoneCache = {};
        dtfCache = {};
      }

      /**
       * Returns whether the provided string is a valid specifier. This only checks the string's format, not that the specifier identifies a known zone; see isValidZone for that.
       * @param {string} s - The string to check validity on
       * @example IANAZone.isValidSpecifier("America/New_York") //=> true
       * @example IANAZone.isValidSpecifier("Sport~~blorp") //=> false
       * @deprecated For backward compatibility, this forwards to isValidZone, better use `isValidZone()` directly instead.
       * @return {boolean}
       */
      static isValidSpecifier(s) {
        return this.isValidZone(s);
      }

      /**
       * Returns whether the provided string identifies a real zone
       * @param {string} zone - The string to check
       * @example IANAZone.isValidZone("America/New_York") //=> true
       * @example IANAZone.isValidZone("Fantasia/Castle") //=> false
       * @example IANAZone.isValidZone("Sport~~blorp") //=> false
       * @return {boolean}
       */
      static isValidZone(zone) {
        if (!zone) {
          return false;
        }
        try {
          new Intl.DateTimeFormat("en-US", { timeZone: zone }).format();
          return true;
        } catch (e) {
          return false;
        }
      }

      constructor(name) {
        super();
        /** @private **/
        this.zoneName = name;
        /** @private **/
        this.valid = IANAZone.isValidZone(name);
      }

      /**
       * The type of zone. `iana` for all instances of `IANAZone`.
       * @override
       * @type {string}
       */
      get type() {
        return "iana";
      }

      /**
       * The name of this zone (i.e. the IANA zone name).
       * @override
       * @type {string}
       */
      get name() {
        return this.zoneName;
      }

      /**
       * Returns whether the offset is known to be fixed for the whole year:
       * Always returns false for all IANA zones.
       * @override
       * @type {boolean}
       */
      get isUniversal() {
        return false;
      }

      /**
       * Returns the offset's common name (such as EST) at the specified timestamp
       * @override
       * @param {number} ts - Epoch milliseconds for which to get the name
       * @param {Object} opts - Options to affect the format
       * @param {string} opts.format - What style of offset to return. Accepts 'long' or 'short'.
       * @param {string} opts.locale - What locale to return the offset name in.
       * @return {string}
       */
      offsetName(ts, { format, locale }) {
        return parseZoneInfo(ts, format, locale, this.name);
      }

      /**
       * Returns the offset's value as a string
       * @override
       * @param {number} ts - Epoch milliseconds for which to get the offset
       * @param {string} format - What style of offset to return.
       *                          Accepts 'narrow', 'short', or 'techie'. Returning '+6', '+06:00', or '+0600' respectively
       * @return {string}
       */
      formatOffset(ts, format) {
        return formatOffset(this.offset(ts), format);
      }

      /**
       * Return the offset in minutes for this zone at the specified timestamp.
       * @override
       * @param {number} ts - Epoch milliseconds for which to compute the offset
       * @return {number}
       */
      offset(ts) {
        const date = new Date(ts);

        if (isNaN(date)) return NaN;

        const dtf = makeDTF(this.name);
        let [year, month, day, adOrBc, hour, minute, second] = dtf.formatToParts
          ? partsOffset(dtf, date)
          : hackyOffset(dtf, date);

        if (adOrBc === "BC") {
          year = -Math.abs(year) + 1;
        }

        // because we're using hour12 and https://bugs.chromium.org/p/chromium/issues/detail?id=1025564&can=2&q=%2224%3A00%22%20datetimeformat
        const adjustedHour = hour === 24 ? 0 : hour;

        const asUTC = objToLocalTS({
          year,
          month,
          day,
          hour: adjustedHour,
          minute,
          second,
          millisecond: 0,
        });

        let asTS = +date;
        const over = asTS % 1000;
        asTS -= over >= 0 ? over : 1000 + over;
        return (asUTC - asTS) / (60 * 1000);
      }

      /**
       * Return whether this Zone is equal to another zone
       * @override
       * @param {Zone} otherZone - the zone to compare
       * @return {boolean}
       */
      equals(otherZone) {
        return otherZone.type === "iana" && otherZone.name === this.name;
      }

      /**
       * Return whether this Zone is valid.
       * @override
       * @type {boolean}
       */
      get isValid() {
        return this.valid;
      }
    }

    // todo - remap caching

    let intlLFCache = {};
    function getCachedLF(locString, opts = {}) {
      const key = JSON.stringify([locString, opts]);
      let dtf = intlLFCache[key];
      if (!dtf) {
        dtf = new Intl.ListFormat(locString, opts);
        intlLFCache[key] = dtf;
      }
      return dtf;
    }

    let intlDTCache = {};
    function getCachedDTF(locString, opts = {}) {
      const key = JSON.stringify([locString, opts]);
      let dtf = intlDTCache[key];
      if (!dtf) {
        dtf = new Intl.DateTimeFormat(locString, opts);
        intlDTCache[key] = dtf;
      }
      return dtf;
    }

    let intlNumCache = {};
    function getCachedINF(locString, opts = {}) {
      const key = JSON.stringify([locString, opts]);
      let inf = intlNumCache[key];
      if (!inf) {
        inf = new Intl.NumberFormat(locString, opts);
        intlNumCache[key] = inf;
      }
      return inf;
    }

    let intlRelCache = {};
    function getCachedRTF(locString, opts = {}) {
      const { base, ...cacheKeyOpts } = opts; // exclude `base` from the options
      const key = JSON.stringify([locString, cacheKeyOpts]);
      let inf = intlRelCache[key];
      if (!inf) {
        inf = new Intl.RelativeTimeFormat(locString, opts);
        intlRelCache[key] = inf;
      }
      return inf;
    }

    let sysLocaleCache = null;
    function systemLocale() {
      if (sysLocaleCache) {
        return sysLocaleCache;
      } else {
        sysLocaleCache = new Intl.DateTimeFormat().resolvedOptions().locale;
        return sysLocaleCache;
      }
    }

    let intlResolvedOptionsCache = {};
    function getCachedIntResolvedOptions(locString) {
      if (!intlResolvedOptionsCache[locString]) {
        intlResolvedOptionsCache[locString] = new Intl.DateTimeFormat(locString).resolvedOptions();
      }
      return intlResolvedOptionsCache[locString];
    }

    let weekInfoCache = {};
    function getCachedWeekInfo(locString) {
      let data = weekInfoCache[locString];
      if (!data) {
        const locale = new Intl.Locale(locString);
        // browsers currently implement this as a property, but spec says it should be a getter function
        data = "getWeekInfo" in locale ? locale.getWeekInfo() : locale.weekInfo;
        weekInfoCache[locString] = data;
      }
      return data;
    }

    function parseLocaleString(localeStr) {
      // I really want to avoid writing a BCP 47 parser
      // see, e.g. https://github.com/wooorm/bcp-47
      // Instead, we'll do this:

      // a) if the string has no -u extensions, just leave it alone
      // b) if it does, use Intl to resolve everything
      // c) if Intl fails, try again without the -u

      // private subtags and unicode subtags have ordering requirements,
      // and we're not properly parsing this, so just strip out the
      // private ones if they exist.
      const xIndex = localeStr.indexOf("-x-");
      if (xIndex !== -1) {
        localeStr = localeStr.substring(0, xIndex);
      }

      const uIndex = localeStr.indexOf("-u-");
      if (uIndex === -1) {
        return [localeStr];
      } else {
        let options;
        let selectedStr;
        try {
          options = getCachedDTF(localeStr).resolvedOptions();
          selectedStr = localeStr;
        } catch (e) {
          const smaller = localeStr.substring(0, uIndex);
          options = getCachedDTF(smaller).resolvedOptions();
          selectedStr = smaller;
        }

        const { numberingSystem, calendar } = options;
        return [selectedStr, numberingSystem, calendar];
      }
    }

    function intlConfigString(localeStr, numberingSystem, outputCalendar) {
      if (outputCalendar || numberingSystem) {
        if (!localeStr.includes("-u-")) {
          localeStr += "-u";
        }

        if (outputCalendar) {
          localeStr += `-ca-${outputCalendar}`;
        }

        if (numberingSystem) {
          localeStr += `-nu-${numberingSystem}`;
        }
        return localeStr;
      } else {
        return localeStr;
      }
    }

    function mapMonths(f) {
      const ms = [];
      for (let i = 1; i <= 12; i++) {
        const dt = DateTime.utc(2009, i, 1);
        ms.push(f(dt));
      }
      return ms;
    }

    function mapWeekdays(f) {
      const ms = [];
      for (let i = 1; i <= 7; i++) {
        const dt = DateTime.utc(2016, 11, 13 + i);
        ms.push(f(dt));
      }
      return ms;
    }

    function listStuff(loc, length, englishFn, intlFn) {
      const mode = loc.listingMode();

      if (mode === "error") {
        return null;
      } else if (mode === "en") {
        return englishFn(length);
      } else {
        return intlFn(length);
      }
    }

    function supportsFastNumbers(loc) {
      if (loc.numberingSystem && loc.numberingSystem !== "latn") {
        return false;
      } else {
        return (
          loc.numberingSystem === "latn" ||
          !loc.locale ||
          loc.locale.startsWith("en") ||
          getCachedIntResolvedOptions(loc.locale).numberingSystem === "latn"
        );
      }
    }

    /**
     * @private
     */

    class PolyNumberFormatter {
      constructor(intl, forceSimple, opts) {
        this.padTo = opts.padTo || 0;
        this.floor = opts.floor || false;

        const { padTo, floor, ...otherOpts } = opts;

        if (!forceSimple || Object.keys(otherOpts).length > 0) {
          const intlOpts = { useGrouping: false, ...opts };
          if (opts.padTo > 0) intlOpts.minimumIntegerDigits = opts.padTo;
          this.inf = getCachedINF(intl, intlOpts);
        }
      }

      format(i) {
        if (this.inf) {
          const fixed = this.floor ? Math.floor(i) : i;
          return this.inf.format(fixed);
        } else {
          // to match the browser's numberformatter defaults
          const fixed = this.floor ? Math.floor(i) : roundTo(i, 3);
          return padStart(fixed, this.padTo);
        }
      }
    }

    /**
     * @private
     */

    class PolyDateFormatter {
      constructor(dt, intl, opts) {
        this.opts = opts;
        this.originalZone = undefined;

        let z = undefined;
        if (this.opts.timeZone) {
          // Don't apply any workarounds if a timeZone is explicitly provided in opts
          this.dt = dt;
        } else if (dt.zone.type === "fixed") {
          // UTC-8 or Etc/UTC-8 are not part of tzdata, only Etc/GMT+8 and the like.
          // That is why fixed-offset TZ is set to that unless it is:
          // 1. Representing offset 0 when UTC is used to maintain previous behavior and does not become GMT.
          // 2. Unsupported by the browser:
          //    - some do not support Etc/
          //    - < Etc/GMT-14, > Etc/GMT+12, and 30-minute or 45-minute offsets are not part of tzdata
          const gmtOffset = -1 * (dt.offset / 60);
          const offsetZ = gmtOffset >= 0 ? `Etc/GMT+${gmtOffset}` : `Etc/GMT${gmtOffset}`;
          if (dt.offset !== 0 && IANAZone.create(offsetZ).valid) {
            z = offsetZ;
            this.dt = dt;
          } else {
            // Not all fixed-offset zones like Etc/+4:30 are present in tzdata so
            // we manually apply the offset and substitute the zone as needed.
            z = "UTC";
            this.dt = dt.offset === 0 ? dt : dt.setZone("UTC").plus({ minutes: dt.offset });
            this.originalZone = dt.zone;
          }
        } else if (dt.zone.type === "system") {
          this.dt = dt;
        } else if (dt.zone.type === "iana") {
          this.dt = dt;
          z = dt.zone.name;
        } else {
          // Custom zones can have any offset / offsetName so we just manually
          // apply the offset and substitute the zone as needed.
          z = "UTC";
          this.dt = dt.setZone("UTC").plus({ minutes: dt.offset });
          this.originalZone = dt.zone;
        }

        const intlOpts = { ...this.opts };
        intlOpts.timeZone = intlOpts.timeZone || z;
        this.dtf = getCachedDTF(intl, intlOpts);
      }

      format() {
        if (this.originalZone) {
          // If we have to substitute in the actual zone name, we have to use
          // formatToParts so that the timezone can be replaced.
          return this.formatToParts()
            .map(({ value }) => value)
            .join("");
        }
        return this.dtf.format(this.dt.toJSDate());
      }

      formatToParts() {
        const parts = this.dtf.formatToParts(this.dt.toJSDate());
        if (this.originalZone) {
          return parts.map((part) => {
            if (part.type === "timeZoneName") {
              const offsetName = this.originalZone.offsetName(this.dt.ts, {
                locale: this.dt.locale,
                format: this.opts.timeZoneName,
              });
              return {
                ...part,
                value: offsetName,
              };
            } else {
              return part;
            }
          });
        }
        return parts;
      }

      resolvedOptions() {
        return this.dtf.resolvedOptions();
      }
    }

    /**
     * @private
     */
    class PolyRelFormatter {
      constructor(intl, isEnglish, opts) {
        this.opts = { style: "long", ...opts };
        if (!isEnglish && hasRelative()) {
          this.rtf = getCachedRTF(intl, opts);
        }
      }

      format(count, unit) {
        if (this.rtf) {
          return this.rtf.format(count, unit);
        } else {
          return formatRelativeTime(unit, count, this.opts.numeric, this.opts.style !== "long");
        }
      }

      formatToParts(count, unit) {
        if (this.rtf) {
          return this.rtf.formatToParts(count, unit);
        } else {
          return [];
        }
      }
    }

    const fallbackWeekSettings = {
      firstDay: 1,
      minimalDays: 4,
      weekend: [6, 7],
    };

    /**
     * @private
     */
    class Locale {
      static fromOpts(opts) {
        return Locale.create(
          opts.locale,
          opts.numberingSystem,
          opts.outputCalendar,
          opts.weekSettings,
          opts.defaultToEN
        );
      }

      static create(locale, numberingSystem, outputCalendar, weekSettings, defaultToEN = false) {
        const specifiedLocale = locale || Settings.defaultLocale;
        // the system locale is useful for human-readable strings but annoying for parsing/formatting known formats
        const localeR = specifiedLocale || (defaultToEN ? "en-US" : systemLocale());
        const numberingSystemR = numberingSystem || Settings.defaultNumberingSystem;
        const outputCalendarR = outputCalendar || Settings.defaultOutputCalendar;
        const weekSettingsR = validateWeekSettings(weekSettings) || Settings.defaultWeekSettings;
        return new Locale(localeR, numberingSystemR, outputCalendarR, weekSettingsR, specifiedLocale);
      }

      static resetCache() {
        sysLocaleCache = null;
        intlDTCache = {};
        intlNumCache = {};
        intlRelCache = {};
        intlResolvedOptionsCache = {};
      }

      static fromObject({ locale, numberingSystem, outputCalendar, weekSettings } = {}) {
        return Locale.create(locale, numberingSystem, outputCalendar, weekSettings);
      }

      constructor(locale, numbering, outputCalendar, weekSettings, specifiedLocale) {
        const [parsedLocale, parsedNumberingSystem, parsedOutputCalendar] = parseLocaleString(locale);

        this.locale = parsedLocale;
        this.numberingSystem = numbering || parsedNumberingSystem || null;
        this.outputCalendar = outputCalendar || parsedOutputCalendar || null;
        this.weekSettings = weekSettings;
        this.intl = intlConfigString(this.locale, this.numberingSystem, this.outputCalendar);

        this.weekdaysCache = { format: {}, standalone: {} };
        this.monthsCache = { format: {}, standalone: {} };
        this.meridiemCache = null;
        this.eraCache = {};

        this.specifiedLocale = specifiedLocale;
        this.fastNumbersCached = null;
      }

      get fastNumbers() {
        if (this.fastNumbersCached == null) {
          this.fastNumbersCached = supportsFastNumbers(this);
        }

        return this.fastNumbersCached;
      }

      listingMode() {
        const isActuallyEn = this.isEnglish();
        const hasNoWeirdness =
          (this.numberingSystem === null || this.numberingSystem === "latn") &&
          (this.outputCalendar === null || this.outputCalendar === "gregory");
        return isActuallyEn && hasNoWeirdness ? "en" : "intl";
      }

      clone(alts) {
        if (!alts || Object.getOwnPropertyNames(alts).length === 0) {
          return this;
        } else {
          return Locale.create(
            alts.locale || this.specifiedLocale,
            alts.numberingSystem || this.numberingSystem,
            alts.outputCalendar || this.outputCalendar,
            validateWeekSettings(alts.weekSettings) || this.weekSettings,
            alts.defaultToEN || false
          );
        }
      }

      redefaultToEN(alts = {}) {
        return this.clone({ ...alts, defaultToEN: true });
      }

      redefaultToSystem(alts = {}) {
        return this.clone({ ...alts, defaultToEN: false });
      }

      months(length, format = false) {
        return listStuff(this, length, months, () => {
          const intl = format ? { month: length, day: "numeric" } : { month: length },
            formatStr = format ? "format" : "standalone";
          if (!this.monthsCache[formatStr][length]) {
            this.monthsCache[formatStr][length] = mapMonths((dt) => this.extract(dt, intl, "month"));
          }
          return this.monthsCache[formatStr][length];
        });
      }

      weekdays(length, format = false) {
        return listStuff(this, length, weekdays, () => {
          const intl = format
              ? { weekday: length, year: "numeric", month: "long", day: "numeric" }
              : { weekday: length },
            formatStr = format ? "format" : "standalone";
          if (!this.weekdaysCache[formatStr][length]) {
            this.weekdaysCache[formatStr][length] = mapWeekdays((dt) =>
              this.extract(dt, intl, "weekday")
            );
          }
          return this.weekdaysCache[formatStr][length];
        });
      }

      meridiems() {
        return listStuff(
          this,
          undefined,
          () => meridiems,
          () => {
            // In theory there could be aribitrary day periods. We're gonna assume there are exactly two
            // for AM and PM. This is probably wrong, but it's makes parsing way easier.
            if (!this.meridiemCache) {
              const intl = { hour: "numeric", hourCycle: "h12" };
              this.meridiemCache = [DateTime.utc(2016, 11, 13, 9), DateTime.utc(2016, 11, 13, 19)].map(
                (dt) => this.extract(dt, intl, "dayperiod")
              );
            }

            return this.meridiemCache;
          }
        );
      }

      eras(length) {
        return listStuff(this, length, eras, () => {
          const intl = { era: length };

          // This is problematic. Different calendars are going to define eras totally differently. What I need is the minimum set of dates
          // to definitely enumerate them.
          if (!this.eraCache[length]) {
            this.eraCache[length] = [DateTime.utc(-40, 1, 1), DateTime.utc(2017, 1, 1)].map((dt) =>
              this.extract(dt, intl, "era")
            );
          }

          return this.eraCache[length];
        });
      }

      extract(dt, intlOpts, field) {
        const df = this.dtFormatter(dt, intlOpts),
          results = df.formatToParts(),
          matching = results.find((m) => m.type.toLowerCase() === field);
        return matching ? matching.value : null;
      }

      numberFormatter(opts = {}) {
        // this forcesimple option is never used (the only caller short-circuits on it, but it seems safer to leave)
        // (in contrast, the rest of the condition is used heavily)
        return new PolyNumberFormatter(this.intl, opts.forceSimple || this.fastNumbers, opts);
      }

      dtFormatter(dt, intlOpts = {}) {
        return new PolyDateFormatter(dt, this.intl, intlOpts);
      }

      relFormatter(opts = {}) {
        return new PolyRelFormatter(this.intl, this.isEnglish(), opts);
      }

      listFormatter(opts = {}) {
        return getCachedLF(this.intl, opts);
      }

      isEnglish() {
        return (
          this.locale === "en" ||
          this.locale.toLowerCase() === "en-us" ||
          getCachedIntResolvedOptions(this.intl).locale.startsWith("en-us")
        );
      }

      getWeekSettings() {
        if (this.weekSettings) {
          return this.weekSettings;
        } else if (!hasLocaleWeekInfo()) {
          return fallbackWeekSettings;
        } else {
          return getCachedWeekInfo(this.locale);
        }
      }

      getStartOfWeek() {
        return this.getWeekSettings().firstDay;
      }

      getMinDaysInFirstWeek() {
        return this.getWeekSettings().minimalDays;
      }

      getWeekendDays() {
        return this.getWeekSettings().weekend;
      }

      equals(other) {
        return (
          this.locale === other.locale &&
          this.numberingSystem === other.numberingSystem &&
          this.outputCalendar === other.outputCalendar
        );
      }

      toString() {
        return `Locale(${this.locale}, ${this.numberingSystem}, ${this.outputCalendar})`;
      }
    }

    let singleton = null;

    /**
     * A zone with a fixed offset (meaning no DST)
     * @implements {Zone}
     */
    class FixedOffsetZone extends Zone {
      /**
       * Get a singleton instance of UTC
       * @return {FixedOffsetZone}
       */
      static get utcInstance() {
        if (singleton === null) {
          singleton = new FixedOffsetZone(0);
        }
        return singleton;
      }

      /**
       * Get an instance with a specified offset
       * @param {number} offset - The offset in minutes
       * @return {FixedOffsetZone}
       */
      static instance(offset) {
        return offset === 0 ? FixedOffsetZone.utcInstance : new FixedOffsetZone(offset);
      }

      /**
       * Get an instance of FixedOffsetZone from a UTC offset string, like "UTC+6"
       * @param {string} s - The offset string to parse
       * @example FixedOffsetZone.parseSpecifier("UTC+6")
       * @example FixedOffsetZone.parseSpecifier("UTC+06")
       * @example FixedOffsetZone.parseSpecifier("UTC-6:00")
       * @return {FixedOffsetZone}
       */
      static parseSpecifier(s) {
        if (s) {
          const r = s.match(/^utc(?:([+-]\d{1,2})(?::(\d{2}))?)?$/i);
          if (r) {
            return new FixedOffsetZone(signedOffset(r[1], r[2]));
          }
        }
        return null;
      }

      constructor(offset) {
        super();
        /** @private **/
        this.fixed = offset;
      }

      /**
       * The type of zone. `fixed` for all instances of `FixedOffsetZone`.
       * @override
       * @type {string}
       */
      get type() {
        return "fixed";
      }

      /**
       * The name of this zone.
       * All fixed zones' names always start with "UTC" (plus optional offset)
       * @override
       * @type {string}
       */
      get name() {
        return this.fixed === 0 ? "UTC" : `UTC${formatOffset(this.fixed, "narrow")}`;
      }

      /**
       * The IANA name of this zone, i.e. `Etc/UTC` or `Etc/GMT+/-nn`
       *
       * @override
       * @type {string}
       */
      get ianaName() {
        if (this.fixed === 0) {
          return "Etc/UTC";
        } else {
          return `Etc/GMT${formatOffset(-this.fixed, "narrow")}`;
        }
      }

      /**
       * Returns the offset's common name at the specified timestamp.
       *
       * For fixed offset zones this equals to the zone name.
       * @override
       */
      offsetName() {
        return this.name;
      }

      /**
       * Returns the offset's value as a string
       * @override
       * @param {number} ts - Epoch milliseconds for which to get the offset
       * @param {string} format - What style of offset to return.
       *                          Accepts 'narrow', 'short', or 'techie'. Returning '+6', '+06:00', or '+0600' respectively
       * @return {string}
       */
      formatOffset(ts, format) {
        return formatOffset(this.fixed, format);
      }

      /**
       * Returns whether the offset is known to be fixed for the whole year:
       * Always returns true for all fixed offset zones.
       * @override
       * @type {boolean}
       */
      get isUniversal() {
        return true;
      }

      /**
       * Return the offset in minutes for this zone at the specified timestamp.
       *
       * For fixed offset zones, this is constant and does not depend on a timestamp.
       * @override
       * @return {number}
       */
      offset() {
        return this.fixed;
      }

      /**
       * Return whether this Zone is equal to another zone (i.e. also fixed and same offset)
       * @override
       * @param {Zone} otherZone - the zone to compare
       * @return {boolean}
       */
      equals(otherZone) {
        return otherZone.type === "fixed" && otherZone.fixed === this.fixed;
      }

      /**
       * Return whether this Zone is valid:
       * All fixed offset zones are valid.
       * @override
       * @type {boolean}
       */
      get isValid() {
        return true;
      }
    }

    /**
     * A zone that failed to parse. You should never need to instantiate this.
     * @implements {Zone}
     */
    class InvalidZone extends Zone {
      constructor(zoneName) {
        super();
        /**  @private */
        this.zoneName = zoneName;
      }

      /** @override **/
      get type() {
        return "invalid";
      }

      /** @override **/
      get name() {
        return this.zoneName;
      }

      /** @override **/
      get isUniversal() {
        return false;
      }

      /** @override **/
      offsetName() {
        return null;
      }

      /** @override **/
      formatOffset() {
        return "";
      }

      /** @override **/
      offset() {
        return NaN;
      }

      /** @override **/
      equals() {
        return false;
      }

      /** @override **/
      get isValid() {
        return false;
      }
    }

    /**
     * @private
     */


    function normalizeZone(input, defaultZone) {
      if (isUndefined(input) || input === null) {
        return defaultZone;
      } else if (input instanceof Zone) {
        return input;
      } else if (isString(input)) {
        const lowered = input.toLowerCase();
        if (lowered === "default") return defaultZone;
        else if (lowered === "local" || lowered === "system") return SystemZone.instance;
        else if (lowered === "utc" || lowered === "gmt") return FixedOffsetZone.utcInstance;
        else return FixedOffsetZone.parseSpecifier(lowered) || IANAZone.create(input);
      } else if (isNumber(input)) {
        return FixedOffsetZone.instance(input);
      } else if (typeof input === "object" && "offset" in input && typeof input.offset === "function") {
        // This is dumb, but the instanceof check above doesn't seem to really work
        // so we're duck checking it
        return input;
      } else {
        return new InvalidZone(input);
      }
    }

    const numberingSystems = {
      arab: "[\u0660-\u0669]",
      arabext: "[\u06F0-\u06F9]",
      bali: "[\u1B50-\u1B59]",
      beng: "[\u09E6-\u09EF]",
      deva: "[\u0966-\u096F]",
      fullwide: "[\uFF10-\uFF19]",
      gujr: "[\u0AE6-\u0AEF]",
      hanidec: "[〇|一|二|三|四|五|六|七|八|九]",
      khmr: "[\u17E0-\u17E9]",
      knda: "[\u0CE6-\u0CEF]",
      laoo: "[\u0ED0-\u0ED9]",
      limb: "[\u1946-\u194F]",
      mlym: "[\u0D66-\u0D6F]",
      mong: "[\u1810-\u1819]",
      mymr: "[\u1040-\u1049]",
      orya: "[\u0B66-\u0B6F]",
      tamldec: "[\u0BE6-\u0BEF]",
      telu: "[\u0C66-\u0C6F]",
      thai: "[\u0E50-\u0E59]",
      tibt: "[\u0F20-\u0F29]",
      latn: "\\d",
    };

    const numberingSystemsUTF16 = {
      arab: [1632, 1641],
      arabext: [1776, 1785],
      bali: [6992, 7001],
      beng: [2534, 2543],
      deva: [2406, 2415],
      fullwide: [65296, 65303],
      gujr: [2790, 2799],
      khmr: [6112, 6121],
      knda: [3302, 3311],
      laoo: [3792, 3801],
      limb: [6470, 6479],
      mlym: [3430, 3439],
      mong: [6160, 6169],
      mymr: [4160, 4169],
      orya: [2918, 2927],
      tamldec: [3046, 3055],
      telu: [3174, 3183],
      thai: [3664, 3673],
      tibt: [3872, 3881],
    };

    const hanidecChars = numberingSystems.hanidec.replace(/[\[|\]]/g, "").split("");

    function parseDigits(str) {
      let value = parseInt(str, 10);
      if (isNaN(value)) {
        value = "";
        for (let i = 0; i < str.length; i++) {
          const code = str.charCodeAt(i);

          if (str[i].search(numberingSystems.hanidec) !== -1) {
            value += hanidecChars.indexOf(str[i]);
          } else {
            for (const key in numberingSystemsUTF16) {
              const [min, max] = numberingSystemsUTF16[key];
              if (code >= min && code <= max) {
                value += code - min;
              }
            }
          }
        }
        return parseInt(value, 10);
      } else {
        return value;
      }
    }

    // cache of {numberingSystem: {append: regex}}
    let digitRegexCache = {};
    function resetDigitRegexCache() {
      digitRegexCache = {};
    }

    function digitRegex({ numberingSystem }, append = "") {
      const ns = numberingSystem || "latn";

      if (!digitRegexCache[ns]) {
        digitRegexCache[ns] = {};
      }
      if (!digitRegexCache[ns][append]) {
        digitRegexCache[ns][append] = new RegExp(`${numberingSystems[ns]}${append}`);
      }

      return digitRegexCache[ns][append];
    }

    let now = () => Date.now(),
      defaultZone = "system",
      defaultLocale = null,
      defaultNumberingSystem = null,
      defaultOutputCalendar = null,
      twoDigitCutoffYear = 60,
      throwOnInvalid,
      defaultWeekSettings = null;

    /**
     * Settings contains static getters and setters that control Luxon's overall behavior. Luxon is a simple library with few options, but the ones it does have live here.
     */
    class Settings {
      /**
       * Get the callback for returning the current timestamp.
       * @type {function}
       */
      static get now() {
        return now;
      }

      /**
       * Set the callback for returning the current timestamp.
       * The function should return a number, which will be interpreted as an Epoch millisecond count
       * @type {function}
       * @example Settings.now = () => Date.now() + 3000 // pretend it is 3 seconds in the future
       * @example Settings.now = () => 0 // always pretend it's Jan 1, 1970 at midnight in UTC time
       */
      static set now(n) {
        now = n;
      }

      /**
       * Set the default time zone to create DateTimes in. Does not affect existing instances.
       * Use the value "system" to reset this value to the system's time zone.
       * @type {string}
       */
      static set defaultZone(zone) {
        defaultZone = zone;
      }

      /**
       * Get the default time zone object currently used to create DateTimes. Does not affect existing instances.
       * The default value is the system's time zone (the one set on the machine that runs this code).
       * @type {Zone}
       */
      static get defaultZone() {
        return normalizeZone(defaultZone, SystemZone.instance);
      }

      /**
       * Get the default locale to create DateTimes with. Does not affect existing instances.
       * @type {string}
       */
      static get defaultLocale() {
        return defaultLocale;
      }

      /**
       * Set the default locale to create DateTimes with. Does not affect existing instances.
       * @type {string}
       */
      static set defaultLocale(locale) {
        defaultLocale = locale;
      }

      /**
       * Get the default numbering system to create DateTimes with. Does not affect existing instances.
       * @type {string}
       */
      static get defaultNumberingSystem() {
        return defaultNumberingSystem;
      }

      /**
       * Set the default numbering system to create DateTimes with. Does not affect existing instances.
       * @type {string}
       */
      static set defaultNumberingSystem(numberingSystem) {
        defaultNumberingSystem = numberingSystem;
      }

      /**
       * Get the default output calendar to create DateTimes with. Does not affect existing instances.
       * @type {string}
       */
      static get defaultOutputCalendar() {
        return defaultOutputCalendar;
      }

      /**
       * Set the default output calendar to create DateTimes with. Does not affect existing instances.
       * @type {string}
       */
      static set defaultOutputCalendar(outputCalendar) {
        defaultOutputCalendar = outputCalendar;
      }

      /**
       * @typedef {Object} WeekSettings
       * @property {number} firstDay
       * @property {number} minimalDays
       * @property {number[]} weekend
       */

      /**
       * @return {WeekSettings|null}
       */
      static get defaultWeekSettings() {
        return defaultWeekSettings;
      }

      /**
       * Allows overriding the default locale week settings, i.e. the start of the week, the weekend and
       * how many days are required in the first week of a year.
       * Does not affect existing instances.
       *
       * @param {WeekSettings|null} weekSettings
       */
      static set defaultWeekSettings(weekSettings) {
        defaultWeekSettings = validateWeekSettings(weekSettings);
      }

      /**
       * Get the cutoff year for whether a 2-digit year string is interpreted in the current or previous century. Numbers higher than the cutoff will be considered to mean 19xx and numbers lower or equal to the cutoff will be considered 20xx.
       * @type {number}
       */
      static get twoDigitCutoffYear() {
        return twoDigitCutoffYear;
      }

      /**
       * Set the cutoff year for whether a 2-digit year string is interpreted in the current or previous century. Numbers higher than the cutoff will be considered to mean 19xx and numbers lower or equal to the cutoff will be considered 20xx.
       * @type {number}
       * @example Settings.twoDigitCutoffYear = 0 // all 'yy' are interpreted as 20th century
       * @example Settings.twoDigitCutoffYear = 99 // all 'yy' are interpreted as 21st century
       * @example Settings.twoDigitCutoffYear = 50 // '49' -> 2049; '50' -> 1950
       * @example Settings.twoDigitCutoffYear = 1950 // interpreted as 50
       * @example Settings.twoDigitCutoffYear = 2050 // ALSO interpreted as 50
       */
      static set twoDigitCutoffYear(cutoffYear) {
        twoDigitCutoffYear = cutoffYear % 100;
      }

      /**
       * Get whether Luxon will throw when it encounters invalid DateTimes, Durations, or Intervals
       * @type {boolean}
       */
      static get throwOnInvalid() {
        return throwOnInvalid;
      }

      /**
       * Set whether Luxon will throw when it encounters invalid DateTimes, Durations, or Intervals
       * @type {boolean}
       */
      static set throwOnInvalid(t) {
        throwOnInvalid = t;
      }

      /**
       * Reset Luxon's global caches. Should only be necessary in testing scenarios.
       * @return {void}
       */
      static resetCaches() {
        Locale.resetCache();
        IANAZone.resetCache();
        DateTime.resetCache();
        resetDigitRegexCache();
      }
    }

    class Invalid {
      constructor(reason, explanation) {
        this.reason = reason;
        this.explanation = explanation;
      }

      toMessage() {
        if (this.explanation) {
          return `${this.reason}: ${this.explanation}`;
        } else {
          return this.reason;
        }
      }
    }

    const nonLeapLadder = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
      leapLadder = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];

    function unitOutOfRange(unit, value) {
      return new Invalid(
        "unit out of range",
        `you specified ${value} (of type ${typeof value}) as a ${unit}, which is invalid`
      );
    }

    function dayOfWeek(year, month, day) {
      const d = new Date(Date.UTC(year, month - 1, day));

      if (year < 100 && year >= 0) {
        d.setUTCFullYear(d.getUTCFullYear() - 1900);
      }

      const js = d.getUTCDay();

      return js === 0 ? 7 : js;
    }

    function computeOrdinal(year, month, day) {
      return day + (isLeapYear(year) ? leapLadder : nonLeapLadder)[month - 1];
    }

    function uncomputeOrdinal(year, ordinal) {
      const table = isLeapYear(year) ? leapLadder : nonLeapLadder,
        month0 = table.findIndex((i) => i < ordinal),
        day = ordinal - table[month0];
      return { month: month0 + 1, day };
    }

    function isoWeekdayToLocal(isoWeekday, startOfWeek) {
      return ((isoWeekday - startOfWeek + 7) % 7) + 1;
    }

    /**
     * @private
     */

    function gregorianToWeek(gregObj, minDaysInFirstWeek = 4, startOfWeek = 1) {
      const { year, month, day } = gregObj,
        ordinal = computeOrdinal(year, month, day),
        weekday = isoWeekdayToLocal(dayOfWeek(year, month, day), startOfWeek);

      let weekNumber = Math.floor((ordinal - weekday + 14 - minDaysInFirstWeek) / 7),
        weekYear;

      if (weekNumber < 1) {
        weekYear = year - 1;
        weekNumber = weeksInWeekYear(weekYear, minDaysInFirstWeek, startOfWeek);
      } else if (weekNumber > weeksInWeekYear(year, minDaysInFirstWeek, startOfWeek)) {
        weekYear = year + 1;
        weekNumber = 1;
      } else {
        weekYear = year;
      }

      return { weekYear, weekNumber, weekday, ...timeObject(gregObj) };
    }

    function weekToGregorian(weekData, minDaysInFirstWeek = 4, startOfWeek = 1) {
      const { weekYear, weekNumber, weekday } = weekData,
        weekdayOfJan4 = isoWeekdayToLocal(dayOfWeek(weekYear, 1, minDaysInFirstWeek), startOfWeek),
        yearInDays = daysInYear(weekYear);

      let ordinal = weekNumber * 7 + weekday - weekdayOfJan4 - 7 + minDaysInFirstWeek,
        year;

      if (ordinal < 1) {
        year = weekYear - 1;
        ordinal += daysInYear(year);
      } else if (ordinal > yearInDays) {
        year = weekYear + 1;
        ordinal -= daysInYear(weekYear);
      } else {
        year = weekYear;
      }

      const { month, day } = uncomputeOrdinal(year, ordinal);
      return { year, month, day, ...timeObject(weekData) };
    }

    function gregorianToOrdinal(gregData) {
      const { year, month, day } = gregData;
      const ordinal = computeOrdinal(year, month, day);
      return { year, ordinal, ...timeObject(gregData) };
    }

    function ordinalToGregorian(ordinalData) {
      const { year, ordinal } = ordinalData;
      const { month, day } = uncomputeOrdinal(year, ordinal);
      return { year, month, day, ...timeObject(ordinalData) };
    }

    /**
     * Check if local week units like localWeekday are used in obj.
     * If so, validates that they are not mixed with ISO week units and then copies them to the normal week unit properties.
     * Modifies obj in-place!
     * @param obj the object values
     */
    function usesLocalWeekValues(obj, loc) {
      const hasLocaleWeekData =
        !isUndefined(obj.localWeekday) ||
        !isUndefined(obj.localWeekNumber) ||
        !isUndefined(obj.localWeekYear);
      if (hasLocaleWeekData) {
        const hasIsoWeekData =
          !isUndefined(obj.weekday) || !isUndefined(obj.weekNumber) || !isUndefined(obj.weekYear);

        if (hasIsoWeekData) {
          throw new ConflictingSpecificationError(
            "Cannot mix locale-based week fields with ISO-based week fields"
          );
        }
        if (!isUndefined(obj.localWeekday)) obj.weekday = obj.localWeekday;
        if (!isUndefined(obj.localWeekNumber)) obj.weekNumber = obj.localWeekNumber;
        if (!isUndefined(obj.localWeekYear)) obj.weekYear = obj.localWeekYear;
        delete obj.localWeekday;
        delete obj.localWeekNumber;
        delete obj.localWeekYear;
        return {
          minDaysInFirstWeek: loc.getMinDaysInFirstWeek(),
          startOfWeek: loc.getStartOfWeek(),
        };
      } else {
        return { minDaysInFirstWeek: 4, startOfWeek: 1 };
      }
    }

    function hasInvalidWeekData(obj, minDaysInFirstWeek = 4, startOfWeek = 1) {
      const validYear = isInteger(obj.weekYear),
        validWeek = integerBetween(
          obj.weekNumber,
          1,
          weeksInWeekYear(obj.weekYear, minDaysInFirstWeek, startOfWeek)
        ),
        validWeekday = integerBetween(obj.weekday, 1, 7);

      if (!validYear) {
        return unitOutOfRange("weekYear", obj.weekYear);
      } else if (!validWeek) {
        return unitOutOfRange("week", obj.weekNumber);
      } else if (!validWeekday) {
        return unitOutOfRange("weekday", obj.weekday);
      } else return false;
    }

    function hasInvalidOrdinalData(obj) {
      const validYear = isInteger(obj.year),
        validOrdinal = integerBetween(obj.ordinal, 1, daysInYear(obj.year));

      if (!validYear) {
        return unitOutOfRange("year", obj.year);
      } else if (!validOrdinal) {
        return unitOutOfRange("ordinal", obj.ordinal);
      } else return false;
    }

    function hasInvalidGregorianData(obj) {
      const validYear = isInteger(obj.year),
        validMonth = integerBetween(obj.month, 1, 12),
        validDay = integerBetween(obj.day, 1, daysInMonth(obj.year, obj.month));

      if (!validYear) {
        return unitOutOfRange("year", obj.year);
      } else if (!validMonth) {
        return unitOutOfRange("month", obj.month);
      } else if (!validDay) {
        return unitOutOfRange("day", obj.day);
      } else return false;
    }

    function hasInvalidTimeData(obj) {
      const { hour, minute, second, millisecond } = obj;
      const validHour =
          integerBetween(hour, 0, 23) ||
          (hour === 24 && minute === 0 && second === 0 && millisecond === 0),
        validMinute = integerBetween(minute, 0, 59),
        validSecond = integerBetween(second, 0, 59),
        validMillisecond = integerBetween(millisecond, 0, 999);

      if (!validHour) {
        return unitOutOfRange("hour", hour);
      } else if (!validMinute) {
        return unitOutOfRange("minute", minute);
      } else if (!validSecond) {
        return unitOutOfRange("second", second);
      } else if (!validMillisecond) {
        return unitOutOfRange("millisecond", millisecond);
      } else return false;
    }

    /*
      This is just a junk drawer, containing anything used across multiple classes.
      Because Luxon is small(ish), this should stay small and we won't worry about splitting
      it up into, say, parsingUtil.js and basicUtil.js and so on. But they are divided up by feature area.
    */


    /**
     * @private
     */

    // TYPES

    function isUndefined(o) {
      return typeof o === "undefined";
    }

    function isNumber(o) {
      return typeof o === "number";
    }

    function isInteger(o) {
      return typeof o === "number" && o % 1 === 0;
    }

    function isString(o) {
      return typeof o === "string";
    }

    function isDate(o) {
      return Object.prototype.toString.call(o) === "[object Date]";
    }

    // CAPABILITIES

    function hasRelative() {
      try {
        return typeof Intl !== "undefined" && !!Intl.RelativeTimeFormat;
      } catch (e) {
        return false;
      }
    }

    function hasLocaleWeekInfo() {
      try {
        return (
          typeof Intl !== "undefined" &&
          !!Intl.Locale &&
          ("weekInfo" in Intl.Locale.prototype || "getWeekInfo" in Intl.Locale.prototype)
        );
      } catch (e) {
        return false;
      }
    }

    // OBJECTS AND ARRAYS

    function maybeArray(thing) {
      return Array.isArray(thing) ? thing : [thing];
    }

    function bestBy(arr, by, compare) {
      if (arr.length === 0) {
        return undefined;
      }
      return arr.reduce((best, next) => {
        const pair = [by(next), next];
        if (!best) {
          return pair;
        } else if (compare(best[0], pair[0]) === best[0]) {
          return best;
        } else {
          return pair;
        }
      }, null)[1];
    }

    function pick(obj, keys) {
      return keys.reduce((a, k) => {
        a[k] = obj[k];
        return a;
      }, {});
    }

    function hasOwnProperty(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }

    function validateWeekSettings(settings) {
      if (settings == null) {
        return null;
      } else if (typeof settings !== "object") {
        throw new InvalidArgumentError("Week settings must be an object");
      } else {
        if (
          !integerBetween(settings.firstDay, 1, 7) ||
          !integerBetween(settings.minimalDays, 1, 7) ||
          !Array.isArray(settings.weekend) ||
          settings.weekend.some((v) => !integerBetween(v, 1, 7))
        ) {
          throw new InvalidArgumentError("Invalid week settings");
        }
        return {
          firstDay: settings.firstDay,
          minimalDays: settings.minimalDays,
          weekend: Array.from(settings.weekend),
        };
      }
    }

    // NUMBERS AND STRINGS

    function integerBetween(thing, bottom, top) {
      return isInteger(thing) && thing >= bottom && thing <= top;
    }

    // x % n but takes the sign of n instead of x
    function floorMod(x, n) {
      return x - n * Math.floor(x / n);
    }

    function padStart(input, n = 2) {
      const isNeg = input < 0;
      let padded;
      if (isNeg) {
        padded = "-" + ("" + -input).padStart(n, "0");
      } else {
        padded = ("" + input).padStart(n, "0");
      }
      return padded;
    }

    function parseInteger(string) {
      if (isUndefined(string) || string === null || string === "") {
        return undefined;
      } else {
        return parseInt(string, 10);
      }
    }

    function parseFloating(string) {
      if (isUndefined(string) || string === null || string === "") {
        return undefined;
      } else {
        return parseFloat(string);
      }
    }

    function parseMillis(fraction) {
      // Return undefined (instead of 0) in these cases, where fraction is not set
      if (isUndefined(fraction) || fraction === null || fraction === "") {
        return undefined;
      } else {
        const f = parseFloat("0." + fraction) * 1000;
        return Math.floor(f);
      }
    }

    function roundTo(number, digits, towardZero = false) {
      const factor = 10 ** digits,
        rounder = towardZero ? Math.trunc : Math.round;
      return rounder(number * factor) / factor;
    }

    // DATE BASICS

    function isLeapYear(year) {
      return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    }

    function daysInYear(year) {
      return isLeapYear(year) ? 366 : 365;
    }

    function daysInMonth(year, month) {
      const modMonth = floorMod(month - 1, 12) + 1,
        modYear = year + (month - modMonth) / 12;

      if (modMonth === 2) {
        return isLeapYear(modYear) ? 29 : 28;
      } else {
        return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][modMonth - 1];
      }
    }

    // convert a calendar object to a local timestamp (epoch, but with the offset baked in)
    function objToLocalTS(obj) {
      let d = Date.UTC(
        obj.year,
        obj.month - 1,
        obj.day,
        obj.hour,
        obj.minute,
        obj.second,
        obj.millisecond
      );

      // for legacy reasons, years between 0 and 99 are interpreted as 19XX; revert that
      if (obj.year < 100 && obj.year >= 0) {
        d = new Date(d);
        // set the month and day again, this is necessary because year 2000 is a leap year, but year 100 is not
        // so if obj.year is in 99, but obj.day makes it roll over into year 100,
        // the calculations done by Date.UTC are using year 2000 - which is incorrect
        d.setUTCFullYear(obj.year, obj.month - 1, obj.day);
      }
      return +d;
    }

    // adapted from moment.js: https://github.com/moment/moment/blob/000ac1800e620f770f4eb31b5ae908f6167b0ab2/src/lib/units/week-calendar-utils.js
    function firstWeekOffset(year, minDaysInFirstWeek, startOfWeek) {
      const fwdlw = isoWeekdayToLocal(dayOfWeek(year, 1, minDaysInFirstWeek), startOfWeek);
      return -fwdlw + minDaysInFirstWeek - 1;
    }

    function weeksInWeekYear(weekYear, minDaysInFirstWeek = 4, startOfWeek = 1) {
      const weekOffset = firstWeekOffset(weekYear, minDaysInFirstWeek, startOfWeek);
      const weekOffsetNext = firstWeekOffset(weekYear + 1, minDaysInFirstWeek, startOfWeek);
      return (daysInYear(weekYear) - weekOffset + weekOffsetNext) / 7;
    }

    function untruncateYear(year) {
      if (year > 99) {
        return year;
      } else return year > Settings.twoDigitCutoffYear ? 1900 + year : 2000 + year;
    }

    // PARSING

    function parseZoneInfo(ts, offsetFormat, locale, timeZone = null) {
      const date = new Date(ts),
        intlOpts = {
          hourCycle: "h23",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        };

      if (timeZone) {
        intlOpts.timeZone = timeZone;
      }

      const modified = { timeZoneName: offsetFormat, ...intlOpts };

      const parsed = new Intl.DateTimeFormat(locale, modified)
        .formatToParts(date)
        .find((m) => m.type.toLowerCase() === "timezonename");
      return parsed ? parsed.value : null;
    }

    // signedOffset('-5', '30') -> -330
    function signedOffset(offHourStr, offMinuteStr) {
      let offHour = parseInt(offHourStr, 10);

      // don't || this because we want to preserve -0
      if (Number.isNaN(offHour)) {
        offHour = 0;
      }

      const offMin = parseInt(offMinuteStr, 10) || 0,
        offMinSigned = offHour < 0 || Object.is(offHour, -0) ? -offMin : offMin;
      return offHour * 60 + offMinSigned;
    }

    // COERCION

    function asNumber(value) {
      const numericValue = Number(value);
      if (typeof value === "boolean" || value === "" || Number.isNaN(numericValue))
        throw new InvalidArgumentError(`Invalid unit value ${value}`);
      return numericValue;
    }

    function normalizeObject(obj, normalizer) {
      const normalized = {};
      for (const u in obj) {
        if (hasOwnProperty(obj, u)) {
          const v = obj[u];
          if (v === undefined || v === null) continue;
          normalized[normalizer(u)] = asNumber(v);
        }
      }
      return normalized;
    }

    /**
     * Returns the offset's value as a string
     * @param {number} ts - Epoch milliseconds for which to get the offset
     * @param {string} format - What style of offset to return.
     *                          Accepts 'narrow', 'short', or 'techie'. Returning '+6', '+06:00', or '+0600' respectively
     * @return {string}
     */
    function formatOffset(offset, format) {
      const hours = Math.trunc(Math.abs(offset / 60)),
        minutes = Math.trunc(Math.abs(offset % 60)),
        sign = offset >= 0 ? "+" : "-";

      switch (format) {
        case "short":
          return `${sign}${padStart(hours, 2)}:${padStart(minutes, 2)}`;
        case "narrow":
          return `${sign}${hours}${minutes > 0 ? `:${minutes}` : ""}`;
        case "techie":
          return `${sign}${padStart(hours, 2)}${padStart(minutes, 2)}`;
        default:
          throw new RangeError(`Value format ${format} is out of range for property format`);
      }
    }

    function timeObject(obj) {
      return pick(obj, ["hour", "minute", "second", "millisecond"]);
    }

    /**
     * @private
     */

    const monthsLong = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const monthsShort = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthsNarrow = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

    function months(length) {
      switch (length) {
        case "narrow":
          return [...monthsNarrow];
        case "short":
          return [...monthsShort];
        case "long":
          return [...monthsLong];
        case "numeric":
          return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
        case "2-digit":
          return ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
        default:
          return null;
      }
    }

    const weekdaysLong = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    const weekdaysShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const weekdaysNarrow = ["M", "T", "W", "T", "F", "S", "S"];

    function weekdays(length) {
      switch (length) {
        case "narrow":
          return [...weekdaysNarrow];
        case "short":
          return [...weekdaysShort];
        case "long":
          return [...weekdaysLong];
        case "numeric":
          return ["1", "2", "3", "4", "5", "6", "7"];
        default:
          return null;
      }
    }

    const meridiems = ["AM", "PM"];

    const erasLong = ["Before Christ", "Anno Domini"];

    const erasShort = ["BC", "AD"];

    const erasNarrow = ["B", "A"];

    function eras(length) {
      switch (length) {
        case "narrow":
          return [...erasNarrow];
        case "short":
          return [...erasShort];
        case "long":
          return [...erasLong];
        default:
          return null;
      }
    }

    function meridiemForDateTime(dt) {
      return meridiems[dt.hour < 12 ? 0 : 1];
    }

    function weekdayForDateTime(dt, length) {
      return weekdays(length)[dt.weekday - 1];
    }

    function monthForDateTime(dt, length) {
      return months(length)[dt.month - 1];
    }

    function eraForDateTime(dt, length) {
      return eras(length)[dt.year < 0 ? 0 : 1];
    }

    function formatRelativeTime(unit, count, numeric = "always", narrow = false) {
      const units = {
        years: ["year", "yr."],
        quarters: ["quarter", "qtr."],
        months: ["month", "mo."],
        weeks: ["week", "wk."],
        days: ["day", "day", "days"],
        hours: ["hour", "hr."],
        minutes: ["minute", "min."],
        seconds: ["second", "sec."],
      };

      const lastable = ["hours", "minutes", "seconds"].indexOf(unit) === -1;

      if (numeric === "auto" && lastable) {
        const isDay = unit === "days";
        switch (count) {
          case 1:
            return isDay ? "tomorrow" : `next ${units[unit][0]}`;
          case -1:
            return isDay ? "yesterday" : `last ${units[unit][0]}`;
          case 0:
            return isDay ? "today" : `this ${units[unit][0]}`;
        }
      }

      const isInPast = Object.is(count, -0) || count < 0,
        fmtValue = Math.abs(count),
        singular = fmtValue === 1,
        lilUnits = units[unit],
        fmtUnit = narrow
          ? singular
            ? lilUnits[1]
            : lilUnits[2] || lilUnits[1]
          : singular
          ? units[unit][0]
          : unit;
      return isInPast ? `${fmtValue} ${fmtUnit} ago` : `in ${fmtValue} ${fmtUnit}`;
    }

    function stringifyTokens(splits, tokenToString) {
      let s = "";
      for (const token of splits) {
        if (token.literal) {
          s += token.val;
        } else {
          s += tokenToString(token.val);
        }
      }
      return s;
    }

    const macroTokenToFormatOpts = {
      D: DATE_SHORT,
      DD: DATE_MED,
      DDD: DATE_FULL,
      DDDD: DATE_HUGE,
      t: TIME_SIMPLE,
      tt: TIME_WITH_SECONDS,
      ttt: TIME_WITH_SHORT_OFFSET,
      tttt: TIME_WITH_LONG_OFFSET,
      T: TIME_24_SIMPLE,
      TT: TIME_24_WITH_SECONDS,
      TTT: TIME_24_WITH_SHORT_OFFSET,
      TTTT: TIME_24_WITH_LONG_OFFSET,
      f: DATETIME_SHORT,
      ff: DATETIME_MED,
      fff: DATETIME_FULL,
      ffff: DATETIME_HUGE,
      F: DATETIME_SHORT_WITH_SECONDS,
      FF: DATETIME_MED_WITH_SECONDS,
      FFF: DATETIME_FULL_WITH_SECONDS,
      FFFF: DATETIME_HUGE_WITH_SECONDS,
    };

    /**
     * @private
     */

    class Formatter {
      static create(locale, opts = {}) {
        return new Formatter(locale, opts);
      }

      static parseFormat(fmt) {
        // white-space is always considered a literal in user-provided formats
        // the " " token has a special meaning (see unitForToken)

        let current = null,
          currentFull = "",
          bracketed = false;
        const splits = [];
        for (let i = 0; i < fmt.length; i++) {
          const c = fmt.charAt(i);
          if (c === "'") {
            if (currentFull.length > 0) {
              splits.push({ literal: bracketed || /^\s+$/.test(currentFull), val: currentFull });
            }
            current = null;
            currentFull = "";
            bracketed = !bracketed;
          } else if (bracketed) {
            currentFull += c;
          } else if (c === current) {
            currentFull += c;
          } else {
            if (currentFull.length > 0) {
              splits.push({ literal: /^\s+$/.test(currentFull), val: currentFull });
            }
            currentFull = c;
            current = c;
          }
        }

        if (currentFull.length > 0) {
          splits.push({ literal: bracketed || /^\s+$/.test(currentFull), val: currentFull });
        }

        return splits;
      }

      static macroTokenToFormatOpts(token) {
        return macroTokenToFormatOpts[token];
      }

      constructor(locale, formatOpts) {
        this.opts = formatOpts;
        this.loc = locale;
        this.systemLoc = null;
      }

      formatWithSystemDefault(dt, opts) {
        if (this.systemLoc === null) {
          this.systemLoc = this.loc.redefaultToSystem();
        }
        const df = this.systemLoc.dtFormatter(dt, { ...this.opts, ...opts });
        return df.format();
      }

      dtFormatter(dt, opts = {}) {
        return this.loc.dtFormatter(dt, { ...this.opts, ...opts });
      }

      formatDateTime(dt, opts) {
        return this.dtFormatter(dt, opts).format();
      }

      formatDateTimeParts(dt, opts) {
        return this.dtFormatter(dt, opts).formatToParts();
      }

      formatInterval(interval, opts) {
        const df = this.dtFormatter(interval.start, opts);
        return df.dtf.formatRange(interval.start.toJSDate(), interval.end.toJSDate());
      }

      resolvedOptions(dt, opts) {
        return this.dtFormatter(dt, opts).resolvedOptions();
      }

      num(n, p = 0) {
        // we get some perf out of doing this here, annoyingly
        if (this.opts.forceSimple) {
          return padStart(n, p);
        }

        const opts = { ...this.opts };

        if (p > 0) {
          opts.padTo = p;
        }

        return this.loc.numberFormatter(opts).format(n);
      }

      formatDateTimeFromString(dt, fmt) {
        const knownEnglish = this.loc.listingMode() === "en",
          useDateTimeFormatter = this.loc.outputCalendar && this.loc.outputCalendar !== "gregory",
          string = (opts, extract) => this.loc.extract(dt, opts, extract),
          formatOffset = (opts) => {
            if (dt.isOffsetFixed && dt.offset === 0 && opts.allowZ) {
              return "Z";
            }

            return dt.isValid ? dt.zone.formatOffset(dt.ts, opts.format) : "";
          },
          meridiem = () =>
            knownEnglish
              ? meridiemForDateTime(dt)
              : string({ hour: "numeric", hourCycle: "h12" }, "dayperiod"),
          month = (length, standalone) =>
            knownEnglish
              ? monthForDateTime(dt, length)
              : string(standalone ? { month: length } : { month: length, day: "numeric" }, "month"),
          weekday = (length, standalone) =>
            knownEnglish
              ? weekdayForDateTime(dt, length)
              : string(
                  standalone ? { weekday: length } : { weekday: length, month: "long", day: "numeric" },
                  "weekday"
                ),
          maybeMacro = (token) => {
            const formatOpts = Formatter.macroTokenToFormatOpts(token);
            if (formatOpts) {
              return this.formatWithSystemDefault(dt, formatOpts);
            } else {
              return token;
            }
          },
          era = (length) =>
            knownEnglish ? eraForDateTime(dt, length) : string({ era: length }, "era"),
          tokenToString = (token) => {
            // Where possible: https://cldr.unicode.org/translation/date-time/date-time-symbols
            switch (token) {
              // ms
              case "S":
                return this.num(dt.millisecond);
              case "u":
              // falls through
              case "SSS":
                return this.num(dt.millisecond, 3);
              // seconds
              case "s":
                return this.num(dt.second);
              case "ss":
                return this.num(dt.second, 2);
              // fractional seconds
              case "uu":
                return this.num(Math.floor(dt.millisecond / 10), 2);
              case "uuu":
                return this.num(Math.floor(dt.millisecond / 100));
              // minutes
              case "m":
                return this.num(dt.minute);
              case "mm":
                return this.num(dt.minute, 2);
              // hours
              case "h":
                return this.num(dt.hour % 12 === 0 ? 12 : dt.hour % 12);
              case "hh":
                return this.num(dt.hour % 12 === 0 ? 12 : dt.hour % 12, 2);
              case "H":
                return this.num(dt.hour);
              case "HH":
                return this.num(dt.hour, 2);
              // offset
              case "Z":
                // like +6
                return formatOffset({ format: "narrow", allowZ: this.opts.allowZ });
              case "ZZ":
                // like +06:00
                return formatOffset({ format: "short", allowZ: this.opts.allowZ });
              case "ZZZ":
                // like +0600
                return formatOffset({ format: "techie", allowZ: this.opts.allowZ });
              case "ZZZZ":
                // like EST
                return dt.zone.offsetName(dt.ts, { format: "short", locale: this.loc.locale });
              case "ZZZZZ":
                // like Eastern Standard Time
                return dt.zone.offsetName(dt.ts, { format: "long", locale: this.loc.locale });
              // zone
              case "z":
                // like America/New_York
                return dt.zoneName;
              // meridiems
              case "a":
                return meridiem();
              // dates
              case "d":
                return useDateTimeFormatter ? string({ day: "numeric" }, "day") : this.num(dt.day);
              case "dd":
                return useDateTimeFormatter ? string({ day: "2-digit" }, "day") : this.num(dt.day, 2);
              // weekdays - standalone
              case "c":
                // like 1
                return this.num(dt.weekday);
              case "ccc":
                // like 'Tues'
                return weekday("short", true);
              case "cccc":
                // like 'Tuesday'
                return weekday("long", true);
              case "ccccc":
                // like 'T'
                return weekday("narrow", true);
              // weekdays - format
              case "E":
                // like 1
                return this.num(dt.weekday);
              case "EEE":
                // like 'Tues'
                return weekday("short", false);
              case "EEEE":
                // like 'Tuesday'
                return weekday("long", false);
              case "EEEEE":
                // like 'T'
                return weekday("narrow", false);
              // months - standalone
              case "L":
                // like 1
                return useDateTimeFormatter
                  ? string({ month: "numeric", day: "numeric" }, "month")
                  : this.num(dt.month);
              case "LL":
                // like 01, doesn't seem to work
                return useDateTimeFormatter
                  ? string({ month: "2-digit", day: "numeric" }, "month")
                  : this.num(dt.month, 2);
              case "LLL":
                // like Jan
                return month("short", true);
              case "LLLL":
                // like January
                return month("long", true);
              case "LLLLL":
                // like J
                return month("narrow", true);
              // months - format
              case "M":
                // like 1
                return useDateTimeFormatter
                  ? string({ month: "numeric" }, "month")
                  : this.num(dt.month);
              case "MM":
                // like 01
                return useDateTimeFormatter
                  ? string({ month: "2-digit" }, "month")
                  : this.num(dt.month, 2);
              case "MMM":
                // like Jan
                return month("short", false);
              case "MMMM":
                // like January
                return month("long", false);
              case "MMMMM":
                // like J
                return month("narrow", false);
              // years
              case "y":
                // like 2014
                return useDateTimeFormatter ? string({ year: "numeric" }, "year") : this.num(dt.year);
              case "yy":
                // like 14
                return useDateTimeFormatter
                  ? string({ year: "2-digit" }, "year")
                  : this.num(dt.year.toString().slice(-2), 2);
              case "yyyy":
                // like 0012
                return useDateTimeFormatter
                  ? string({ year: "numeric" }, "year")
                  : this.num(dt.year, 4);
              case "yyyyyy":
                // like 000012
                return useDateTimeFormatter
                  ? string({ year: "numeric" }, "year")
                  : this.num(dt.year, 6);
              // eras
              case "G":
                // like AD
                return era("short");
              case "GG":
                // like Anno Domini
                return era("long");
              case "GGGGG":
                return era("narrow");
              case "kk":
                return this.num(dt.weekYear.toString().slice(-2), 2);
              case "kkkk":
                return this.num(dt.weekYear, 4);
              case "W":
                return this.num(dt.weekNumber);
              case "WW":
                return this.num(dt.weekNumber, 2);
              case "n":
                return this.num(dt.localWeekNumber);
              case "nn":
                return this.num(dt.localWeekNumber, 2);
              case "ii":
                return this.num(dt.localWeekYear.toString().slice(-2), 2);
              case "iiii":
                return this.num(dt.localWeekYear, 4);
              case "o":
                return this.num(dt.ordinal);
              case "ooo":
                return this.num(dt.ordinal, 3);
              case "q":
                // like 1
                return this.num(dt.quarter);
              case "qq":
                // like 01
                return this.num(dt.quarter, 2);
              case "X":
                return this.num(Math.floor(dt.ts / 1000));
              case "x":
                return this.num(dt.ts);
              default:
                return maybeMacro(token);
            }
          };

        return stringifyTokens(Formatter.parseFormat(fmt), tokenToString);
      }

      formatDurationFromString(dur, fmt) {
        const tokenToField = (token) => {
            switch (token[0]) {
              case "S":
                return "millisecond";
              case "s":
                return "second";
              case "m":
                return "minute";
              case "h":
                return "hour";
              case "d":
                return "day";
              case "w":
                return "week";
              case "M":
                return "month";
              case "y":
                return "year";
              default:
                return null;
            }
          },
          tokenToString = (lildur) => (token) => {
            const mapped = tokenToField(token);
            if (mapped) {
              return this.num(lildur.get(mapped), token.length);
            } else {
              return token;
            }
          },
          tokens = Formatter.parseFormat(fmt),
          realTokens = tokens.reduce(
            (found, { literal, val }) => (literal ? found : found.concat(val)),
            []
          ),
          collapsed = dur.shiftTo(...realTokens.map(tokenToField).filter((t) => t));
        return stringifyTokens(tokens, tokenToString(collapsed));
      }
    }

    /*
     * This file handles parsing for well-specified formats. Here's how it works:
     * Two things go into parsing: a regex to match with and an extractor to take apart the groups in the match.
     * An extractor is just a function that takes a regex match array and returns a { year: ..., month: ... } object
     * parse() does the work of executing the regex and applying the extractor. It takes multiple regex/extractor pairs to try in sequence.
     * Extractors can take a "cursor" representing the offset in the match to look at. This makes it easy to combine extractors.
     * combineExtractors() does the work of combining them, keeping track of the cursor through multiple extractions.
     * Some extractions are super dumb and simpleParse and fromStrings help DRY them.
     */

    const ianaRegex = /[A-Za-z_+-]{1,256}(?::?\/[A-Za-z0-9_+-]{1,256}(?:\/[A-Za-z0-9_+-]{1,256})?)?/;

    function combineRegexes(...regexes) {
      const full = regexes.reduce((f, r) => f + r.source, "");
      return RegExp(`^${full}$`);
    }

    function combineExtractors(...extractors) {
      return (m) =>
        extractors
          .reduce(
            ([mergedVals, mergedZone, cursor], ex) => {
              const [val, zone, next] = ex(m, cursor);
              return [{ ...mergedVals, ...val }, zone || mergedZone, next];
            },
            [{}, null, 1]
          )
          .slice(0, 2);
    }

    function parse(s, ...patterns) {
      if (s == null) {
        return [null, null];
      }

      for (const [regex, extractor] of patterns) {
        const m = regex.exec(s);
        if (m) {
          return extractor(m);
        }
      }
      return [null, null];
    }

    function simpleParse(...keys) {
      return (match, cursor) => {
        const ret = {};
        let i;

        for (i = 0; i < keys.length; i++) {
          ret[keys[i]] = parseInteger(match[cursor + i]);
        }
        return [ret, null, cursor + i];
      };
    }

    // ISO and SQL parsing
    const offsetRegex = /(?:(Z)|([+-]\d\d)(?::?(\d\d))?)/;
    const isoExtendedZone = `(?:${offsetRegex.source}?(?:\\[(${ianaRegex.source})\\])?)?`;
    const isoTimeBaseRegex = /(\d\d)(?::?(\d\d)(?::?(\d\d)(?:[.,](\d{1,30}))?)?)?/;
    const isoTimeRegex = RegExp(`${isoTimeBaseRegex.source}${isoExtendedZone}`);
    const isoTimeExtensionRegex = RegExp(`(?:T${isoTimeRegex.source})?`);
    const isoYmdRegex = /([+-]\d{6}|\d{4})(?:-?(\d\d)(?:-?(\d\d))?)?/;
    const isoWeekRegex = /(\d{4})-?W(\d\d)(?:-?(\d))?/;
    const isoOrdinalRegex = /(\d{4})-?(\d{3})/;
    const extractISOWeekData = simpleParse("weekYear", "weekNumber", "weekDay");
    const extractISOOrdinalData = simpleParse("year", "ordinal");
    const sqlYmdRegex = /(\d{4})-(\d\d)-(\d\d)/; // dumbed-down version of the ISO one
    const sqlTimeRegex = RegExp(
      `${isoTimeBaseRegex.source} ?(?:${offsetRegex.source}|(${ianaRegex.source}))?`
    );
    const sqlTimeExtensionRegex = RegExp(`(?: ${sqlTimeRegex.source})?`);

    function int(match, pos, fallback) {
      const m = match[pos];
      return isUndefined(m) ? fallback : parseInteger(m);
    }

    function extractISOYmd(match, cursor) {
      const item = {
        year: int(match, cursor),
        month: int(match, cursor + 1, 1),
        day: int(match, cursor + 2, 1),
      };

      return [item, null, cursor + 3];
    }

    function extractISOTime(match, cursor) {
      const item = {
        hours: int(match, cursor, 0),
        minutes: int(match, cursor + 1, 0),
        seconds: int(match, cursor + 2, 0),
        milliseconds: parseMillis(match[cursor + 3]),
      };

      return [item, null, cursor + 4];
    }

    function extractISOOffset(match, cursor) {
      const local = !match[cursor] && !match[cursor + 1],
        fullOffset = signedOffset(match[cursor + 1], match[cursor + 2]),
        zone = local ? null : FixedOffsetZone.instance(fullOffset);
      return [{}, zone, cursor + 3];
    }

    function extractIANAZone(match, cursor) {
      const zone = match[cursor] ? IANAZone.create(match[cursor]) : null;
      return [{}, zone, cursor + 1];
    }

    // ISO time parsing

    const isoTimeOnly = RegExp(`^T?${isoTimeBaseRegex.source}$`);

    // ISO duration parsing

    const isoDuration =
      /^-?P(?:(?:(-?\d{1,20}(?:\.\d{1,20})?)Y)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20}(?:\.\d{1,20})?)W)?(?:(-?\d{1,20}(?:\.\d{1,20})?)D)?(?:T(?:(-?\d{1,20}(?:\.\d{1,20})?)H)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20})(?:[.,](-?\d{1,20}))?S)?)?)$/;

    function extractISODuration(match) {
      const [s, yearStr, monthStr, weekStr, dayStr, hourStr, minuteStr, secondStr, millisecondsStr] =
        match;

      const hasNegativePrefix = s[0] === "-";
      const negativeSeconds = secondStr && secondStr[0] === "-";

      const maybeNegate = (num, force = false) =>
        num !== undefined && (force || (num && hasNegativePrefix)) ? -num : num;

      return [
        {
          years: maybeNegate(parseFloating(yearStr)),
          months: maybeNegate(parseFloating(monthStr)),
          weeks: maybeNegate(parseFloating(weekStr)),
          days: maybeNegate(parseFloating(dayStr)),
          hours: maybeNegate(parseFloating(hourStr)),
          minutes: maybeNegate(parseFloating(minuteStr)),
          seconds: maybeNegate(parseFloating(secondStr), secondStr === "-0"),
          milliseconds: maybeNegate(parseMillis(millisecondsStr), negativeSeconds),
        },
      ];
    }

    // These are a little braindead. EDT *should* tell us that we're in, say, America/New_York
    // and not just that we're in -240 *right now*. But since I don't think these are used that often
    // I'm just going to ignore that
    const obsOffsets = {
      GMT: 0,
      EDT: -4 * 60,
      EST: -5 * 60,
      CDT: -5 * 60,
      CST: -6 * 60,
      MDT: -6 * 60,
      MST: -7 * 60,
      PDT: -7 * 60,
      PST: -8 * 60,
    };

    function fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
      const result = {
        year: yearStr.length === 2 ? untruncateYear(parseInteger(yearStr)) : parseInteger(yearStr),
        month: monthsShort.indexOf(monthStr) + 1,
        day: parseInteger(dayStr),
        hour: parseInteger(hourStr),
        minute: parseInteger(minuteStr),
      };

      if (secondStr) result.second = parseInteger(secondStr);
      if (weekdayStr) {
        result.weekday =
          weekdayStr.length > 3
            ? weekdaysLong.indexOf(weekdayStr) + 1
            : weekdaysShort.indexOf(weekdayStr) + 1;
      }

      return result;
    }

    // RFC 2822/5322
    const rfc2822 =
      /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|(?:([+-]\d\d)(\d\d)))$/;

    function extractRFC2822(match) {
      const [
          ,
          weekdayStr,
          dayStr,
          monthStr,
          yearStr,
          hourStr,
          minuteStr,
          secondStr,
          obsOffset,
          milOffset,
          offHourStr,
          offMinuteStr,
        ] = match,
        result = fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);

      let offset;
      if (obsOffset) {
        offset = obsOffsets[obsOffset];
      } else if (milOffset) {
        offset = 0;
      } else {
        offset = signedOffset(offHourStr, offMinuteStr);
      }

      return [result, new FixedOffsetZone(offset)];
    }

    function preprocessRFC2822(s) {
      // Remove comments and folding whitespace and replace multiple-spaces with a single space
      return s
        .replace(/\([^()]*\)|[\n\t]/g, " ")
        .replace(/(\s\s+)/g, " ")
        .trim();
    }

    // http date

    const rfc1123 =
        /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d\d) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d\d):(\d\d):(\d\d) GMT$/,
      rfc850 =
        /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d\d)-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d\d) (\d\d):(\d\d):(\d\d) GMT$/,
      ascii =
        /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( \d|\d\d) (\d\d):(\d\d):(\d\d) (\d{4})$/;

    function extractRFC1123Or850(match) {
      const [, weekdayStr, dayStr, monthStr, yearStr, hourStr, minuteStr, secondStr] = match,
        result = fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);
      return [result, FixedOffsetZone.utcInstance];
    }

    function extractASCII(match) {
      const [, weekdayStr, monthStr, dayStr, hourStr, minuteStr, secondStr, yearStr] = match,
        result = fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);
      return [result, FixedOffsetZone.utcInstance];
    }

    const isoYmdWithTimeExtensionRegex = combineRegexes(isoYmdRegex, isoTimeExtensionRegex);
    const isoWeekWithTimeExtensionRegex = combineRegexes(isoWeekRegex, isoTimeExtensionRegex);
    const isoOrdinalWithTimeExtensionRegex = combineRegexes(isoOrdinalRegex, isoTimeExtensionRegex);
    const isoTimeCombinedRegex = combineRegexes(isoTimeRegex);

    const extractISOYmdTimeAndOffset = combineExtractors(
      extractISOYmd,
      extractISOTime,
      extractISOOffset,
      extractIANAZone
    );
    const extractISOWeekTimeAndOffset = combineExtractors(
      extractISOWeekData,
      extractISOTime,
      extractISOOffset,
      extractIANAZone
    );
    const extractISOOrdinalDateAndTime = combineExtractors(
      extractISOOrdinalData,
      extractISOTime,
      extractISOOffset,
      extractIANAZone
    );
    const extractISOTimeAndOffset = combineExtractors(
      extractISOTime,
      extractISOOffset,
      extractIANAZone
    );

    /*
     * @private
     */

    function parseISODate(s) {
      return parse(
        s,
        [isoYmdWithTimeExtensionRegex, extractISOYmdTimeAndOffset],
        [isoWeekWithTimeExtensionRegex, extractISOWeekTimeAndOffset],
        [isoOrdinalWithTimeExtensionRegex, extractISOOrdinalDateAndTime],
        [isoTimeCombinedRegex, extractISOTimeAndOffset]
      );
    }

    function parseRFC2822Date(s) {
      return parse(preprocessRFC2822(s), [rfc2822, extractRFC2822]);
    }

    function parseHTTPDate(s) {
      return parse(
        s,
        [rfc1123, extractRFC1123Or850],
        [rfc850, extractRFC1123Or850],
        [ascii, extractASCII]
      );
    }

    function parseISODuration(s) {
      return parse(s, [isoDuration, extractISODuration]);
    }

    const extractISOTimeOnly = combineExtractors(extractISOTime);

    function parseISOTimeOnly(s) {
      return parse(s, [isoTimeOnly, extractISOTimeOnly]);
    }

    const sqlYmdWithTimeExtensionRegex = combineRegexes(sqlYmdRegex, sqlTimeExtensionRegex);
    const sqlTimeCombinedRegex = combineRegexes(sqlTimeRegex);

    const extractISOTimeOffsetAndIANAZone = combineExtractors(
      extractISOTime,
      extractISOOffset,
      extractIANAZone
    );

    function parseSQL(s) {
      return parse(
        s,
        [sqlYmdWithTimeExtensionRegex, extractISOYmdTimeAndOffset],
        [sqlTimeCombinedRegex, extractISOTimeOffsetAndIANAZone]
      );
    }

    const INVALID$2 = "Invalid Duration";

    // unit conversion constants
    const lowOrderMatrix = {
        weeks: {
          days: 7,
          hours: 7 * 24,
          minutes: 7 * 24 * 60,
          seconds: 7 * 24 * 60 * 60,
          milliseconds: 7 * 24 * 60 * 60 * 1000,
        },
        days: {
          hours: 24,
          minutes: 24 * 60,
          seconds: 24 * 60 * 60,
          milliseconds: 24 * 60 * 60 * 1000,
        },
        hours: { minutes: 60, seconds: 60 * 60, milliseconds: 60 * 60 * 1000 },
        minutes: { seconds: 60, milliseconds: 60 * 1000 },
        seconds: { milliseconds: 1000 },
      },
      casualMatrix = {
        years: {
          quarters: 4,
          months: 12,
          weeks: 52,
          days: 365,
          hours: 365 * 24,
          minutes: 365 * 24 * 60,
          seconds: 365 * 24 * 60 * 60,
          milliseconds: 365 * 24 * 60 * 60 * 1000,
        },
        quarters: {
          months: 3,
          weeks: 13,
          days: 91,
          hours: 91 * 24,
          minutes: 91 * 24 * 60,
          seconds: 91 * 24 * 60 * 60,
          milliseconds: 91 * 24 * 60 * 60 * 1000,
        },
        months: {
          weeks: 4,
          days: 30,
          hours: 30 * 24,
          minutes: 30 * 24 * 60,
          seconds: 30 * 24 * 60 * 60,
          milliseconds: 30 * 24 * 60 * 60 * 1000,
        },

        ...lowOrderMatrix,
      },
      daysInYearAccurate = 146097.0 / 400,
      daysInMonthAccurate = 146097.0 / 4800,
      accurateMatrix = {
        years: {
          quarters: 4,
          months: 12,
          weeks: daysInYearAccurate / 7,
          days: daysInYearAccurate,
          hours: daysInYearAccurate * 24,
          minutes: daysInYearAccurate * 24 * 60,
          seconds: daysInYearAccurate * 24 * 60 * 60,
          milliseconds: daysInYearAccurate * 24 * 60 * 60 * 1000,
        },
        quarters: {
          months: 3,
          weeks: daysInYearAccurate / 28,
          days: daysInYearAccurate / 4,
          hours: (daysInYearAccurate * 24) / 4,
          minutes: (daysInYearAccurate * 24 * 60) / 4,
          seconds: (daysInYearAccurate * 24 * 60 * 60) / 4,
          milliseconds: (daysInYearAccurate * 24 * 60 * 60 * 1000) / 4,
        },
        months: {
          weeks: daysInMonthAccurate / 7,
          days: daysInMonthAccurate,
          hours: daysInMonthAccurate * 24,
          minutes: daysInMonthAccurate * 24 * 60,
          seconds: daysInMonthAccurate * 24 * 60 * 60,
          milliseconds: daysInMonthAccurate * 24 * 60 * 60 * 1000,
        },
        ...lowOrderMatrix,
      };

    // units ordered by size
    const orderedUnits$1 = [
      "years",
      "quarters",
      "months",
      "weeks",
      "days",
      "hours",
      "minutes",
      "seconds",
      "milliseconds",
    ];

    const reverseUnits = orderedUnits$1.slice(0).reverse();

    // clone really means "create another instance just like this one, but with these changes"
    function clone$1(dur, alts, clear = false) {
      // deep merge for vals
      const conf = {
        values: clear ? alts.values : { ...dur.values, ...(alts.values || {}) },
        loc: dur.loc.clone(alts.loc),
        conversionAccuracy: alts.conversionAccuracy || dur.conversionAccuracy,
        matrix: alts.matrix || dur.matrix,
      };
      return new Duration(conf);
    }

    function durationToMillis(matrix, vals) {
      let sum = vals.milliseconds ?? 0;
      for (const unit of reverseUnits.slice(1)) {
        if (vals[unit]) {
          sum += vals[unit] * matrix[unit]["milliseconds"];
        }
      }
      return sum;
    }

    // NB: mutates parameters
    function normalizeValues(matrix, vals) {
      // the logic below assumes the overall value of the duration is positive
      // if this is not the case, factor is used to make it so
      const factor = durationToMillis(matrix, vals) < 0 ? -1 : 1;

      orderedUnits$1.reduceRight((previous, current) => {
        if (!isUndefined(vals[current])) {
          if (previous) {
            const previousVal = vals[previous] * factor;
            const conv = matrix[current][previous];

            // if (previousVal < 0):
            // lower order unit is negative (e.g. { years: 2, days: -2 })
            // normalize this by reducing the higher order unit by the appropriate amount
            // and increasing the lower order unit
            // this can never make the higher order unit negative, because this function only operates
            // on positive durations, so the amount of time represented by the lower order unit cannot
            // be larger than the higher order unit
            // else:
            // lower order unit is positive (e.g. { years: 2, days: 450 } or { years: -2, days: 450 })
            // in this case we attempt to convert as much as possible from the lower order unit into
            // the higher order one
            //
            // Math.floor takes care of both of these cases, rounding away from 0
            // if previousVal < 0 it makes the absolute value larger
            // if previousVal >= it makes the absolute value smaller
            const rollUp = Math.floor(previousVal / conv);
            vals[current] += rollUp * factor;
            vals[previous] -= rollUp * conv * factor;
          }
          return current;
        } else {
          return previous;
        }
      }, null);

      // try to convert any decimals into smaller units if possible
      // for example for { years: 2.5, days: 0, seconds: 0 } we want to get { years: 2, days: 182, hours: 12 }
      orderedUnits$1.reduce((previous, current) => {
        if (!isUndefined(vals[current])) {
          if (previous) {
            const fraction = vals[previous] % 1;
            vals[previous] -= fraction;
            vals[current] += fraction * matrix[previous][current];
          }
          return current;
        } else {
          return previous;
        }
      }, null);
    }

    // Remove all properties with a value of 0 from an object
    function removeZeroes(vals) {
      const newVals = {};
      for (const [key, value] of Object.entries(vals)) {
        if (value !== 0) {
          newVals[key] = value;
        }
      }
      return newVals;
    }

    /**
     * A Duration object represents a period of time, like "2 months" or "1 day, 1 hour". Conceptually, it's just a map of units to their quantities, accompanied by some additional configuration and methods for creating, parsing, interrogating, transforming, and formatting them. They can be used on their own or in conjunction with other Luxon types; for example, you can use {@link DateTime#plus} to add a Duration object to a DateTime, producing another DateTime.
     *
     * Here is a brief overview of commonly used methods and getters in Duration:
     *
     * * **Creation** To create a Duration, use {@link Duration.fromMillis}, {@link Duration.fromObject}, or {@link Duration.fromISO}.
     * * **Unit values** See the {@link Duration#years}, {@link Duration#months}, {@link Duration#weeks}, {@link Duration#days}, {@link Duration#hours}, {@link Duration#minutes}, {@link Duration#seconds}, {@link Duration#milliseconds} accessors.
     * * **Configuration** See  {@link Duration#locale} and {@link Duration#numberingSystem} accessors.
     * * **Transformation** To create new Durations out of old ones use {@link Duration#plus}, {@link Duration#minus}, {@link Duration#normalize}, {@link Duration#set}, {@link Duration#reconfigure}, {@link Duration#shiftTo}, and {@link Duration#negate}.
     * * **Output** To convert the Duration into other representations, see {@link Duration#as}, {@link Duration#toISO}, {@link Duration#toFormat}, and {@link Duration#toJSON}
     *
     * There's are more methods documented below. In addition, for more information on subtler topics like internationalization and validity, see the external documentation.
     */
    class Duration {
      /**
       * @private
       */
      constructor(config) {
        const accurate = config.conversionAccuracy === "longterm" || false;
        let matrix = accurate ? accurateMatrix : casualMatrix;

        if (config.matrix) {
          matrix = config.matrix;
        }

        /**
         * @access private
         */
        this.values = config.values;
        /**
         * @access private
         */
        this.loc = config.loc || Locale.create();
        /**
         * @access private
         */
        this.conversionAccuracy = accurate ? "longterm" : "casual";
        /**
         * @access private
         */
        this.invalid = config.invalid || null;
        /**
         * @access private
         */
        this.matrix = matrix;
        /**
         * @access private
         */
        this.isLuxonDuration = true;
      }

      /**
       * Create Duration from a number of milliseconds.
       * @param {number} count of milliseconds
       * @param {Object} opts - options for parsing
       * @param {string} [opts.locale='en-US'] - the locale to use
       * @param {string} opts.numberingSystem - the numbering system to use
       * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
       * @return {Duration}
       */
      static fromMillis(count, opts) {
        return Duration.fromObject({ milliseconds: count }, opts);
      }

      /**
       * Create a Duration from a JavaScript object with keys like 'years' and 'hours'.
       * If this object is empty then a zero milliseconds duration is returned.
       * @param {Object} obj - the object to create the DateTime from
       * @param {number} obj.years
       * @param {number} obj.quarters
       * @param {number} obj.months
       * @param {number} obj.weeks
       * @param {number} obj.days
       * @param {number} obj.hours
       * @param {number} obj.minutes
       * @param {number} obj.seconds
       * @param {number} obj.milliseconds
       * @param {Object} [opts=[]] - options for creating this Duration
       * @param {string} [opts.locale='en-US'] - the locale to use
       * @param {string} opts.numberingSystem - the numbering system to use
       * @param {string} [opts.conversionAccuracy='casual'] - the preset conversion system to use
       * @param {string} [opts.matrix=Object] - the custom conversion system to use
       * @return {Duration}
       */
      static fromObject(obj, opts = {}) {
        if (obj == null || typeof obj !== "object") {
          throw new InvalidArgumentError(
            `Duration.fromObject: argument expected to be an object, got ${
          obj === null ? "null" : typeof obj
        }`
          );
        }

        return new Duration({
          values: normalizeObject(obj, Duration.normalizeUnit),
          loc: Locale.fromObject(opts),
          conversionAccuracy: opts.conversionAccuracy,
          matrix: opts.matrix,
        });
      }

      /**
       * Create a Duration from DurationLike.
       *
       * @param {Object | number | Duration} durationLike
       * One of:
       * - object with keys like 'years' and 'hours'.
       * - number representing milliseconds
       * - Duration instance
       * @return {Duration}
       */
      static fromDurationLike(durationLike) {
        if (isNumber(durationLike)) {
          return Duration.fromMillis(durationLike);
        } else if (Duration.isDuration(durationLike)) {
          return durationLike;
        } else if (typeof durationLike === "object") {
          return Duration.fromObject(durationLike);
        } else {
          throw new InvalidArgumentError(
            `Unknown duration argument ${durationLike} of type ${typeof durationLike}`
          );
        }
      }

      /**
       * Create a Duration from an ISO 8601 duration string.
       * @param {string} text - text to parse
       * @param {Object} opts - options for parsing
       * @param {string} [opts.locale='en-US'] - the locale to use
       * @param {string} opts.numberingSystem - the numbering system to use
       * @param {string} [opts.conversionAccuracy='casual'] - the preset conversion system to use
       * @param {string} [opts.matrix=Object] - the preset conversion system to use
       * @see https://en.wikipedia.org/wiki/ISO_8601#Durations
       * @example Duration.fromISO('P3Y6M1W4DT12H30M5S').toObject() //=> { years: 3, months: 6, weeks: 1, days: 4, hours: 12, minutes: 30, seconds: 5 }
       * @example Duration.fromISO('PT23H').toObject() //=> { hours: 23 }
       * @example Duration.fromISO('P5Y3M').toObject() //=> { years: 5, months: 3 }
       * @return {Duration}
       */
      static fromISO(text, opts) {
        const [parsed] = parseISODuration(text);
        if (parsed) {
          return Duration.fromObject(parsed, opts);
        } else {
          return Duration.invalid("unparsable", `the input "${text}" can't be parsed as ISO 8601`);
        }
      }

      /**
       * Create a Duration from an ISO 8601 time string.
       * @param {string} text - text to parse
       * @param {Object} opts - options for parsing
       * @param {string} [opts.locale='en-US'] - the locale to use
       * @param {string} opts.numberingSystem - the numbering system to use
       * @param {string} [opts.conversionAccuracy='casual'] - the preset conversion system to use
       * @param {string} [opts.matrix=Object] - the conversion system to use
       * @see https://en.wikipedia.org/wiki/ISO_8601#Times
       * @example Duration.fromISOTime('11:22:33.444').toObject() //=> { hours: 11, minutes: 22, seconds: 33, milliseconds: 444 }
       * @example Duration.fromISOTime('11:00').toObject() //=> { hours: 11, minutes: 0, seconds: 0 }
       * @example Duration.fromISOTime('T11:00').toObject() //=> { hours: 11, minutes: 0, seconds: 0 }
       * @example Duration.fromISOTime('1100').toObject() //=> { hours: 11, minutes: 0, seconds: 0 }
       * @example Duration.fromISOTime('T1100').toObject() //=> { hours: 11, minutes: 0, seconds: 0 }
       * @return {Duration}
       */
      static fromISOTime(text, opts) {
        const [parsed] = parseISOTimeOnly(text);
        if (parsed) {
          return Duration.fromObject(parsed, opts);
        } else {
          return Duration.invalid("unparsable", `the input "${text}" can't be parsed as ISO 8601`);
        }
      }

      /**
       * Create an invalid Duration.
       * @param {string} reason - simple string of why this datetime is invalid. Should not contain parameters or anything else data-dependent
       * @param {string} [explanation=null] - longer explanation, may include parameters and other useful debugging information
       * @return {Duration}
       */
      static invalid(reason, explanation = null) {
        if (!reason) {
          throw new InvalidArgumentError("need to specify a reason the Duration is invalid");
        }

        const invalid = reason instanceof Invalid ? reason : new Invalid(reason, explanation);

        if (Settings.throwOnInvalid) {
          throw new InvalidDurationError(invalid);
        } else {
          return new Duration({ invalid });
        }
      }

      /**
       * @private
       */
      static normalizeUnit(unit) {
        const normalized = {
          year: "years",
          years: "years",
          quarter: "quarters",
          quarters: "quarters",
          month: "months",
          months: "months",
          week: "weeks",
          weeks: "weeks",
          day: "days",
          days: "days",
          hour: "hours",
          hours: "hours",
          minute: "minutes",
          minutes: "minutes",
          second: "seconds",
          seconds: "seconds",
          millisecond: "milliseconds",
          milliseconds: "milliseconds",
        }[unit ? unit.toLowerCase() : unit];

        if (!normalized) throw new InvalidUnitError(unit);

        return normalized;
      }

      /**
       * Check if an object is a Duration. Works across context boundaries
       * @param {object} o
       * @return {boolean}
       */
      static isDuration(o) {
        return (o && o.isLuxonDuration) || false;
      }

      /**
       * Get  the locale of a Duration, such 'en-GB'
       * @type {string}
       */
      get locale() {
        return this.isValid ? this.loc.locale : null;
      }

      /**
       * Get the numbering system of a Duration, such 'beng'. The numbering system is used when formatting the Duration
       *
       * @type {string}
       */
      get numberingSystem() {
        return this.isValid ? this.loc.numberingSystem : null;
      }

      /**
       * Returns a string representation of this Duration formatted according to the specified format string. You may use these tokens:
       * * `S` for milliseconds
       * * `s` for seconds
       * * `m` for minutes
       * * `h` for hours
       * * `d` for days
       * * `w` for weeks
       * * `M` for months
       * * `y` for years
       * Notes:
       * * Add padding by repeating the token, e.g. "yy" pads the years to two digits, "hhhh" pads the hours out to four digits
       * * Tokens can be escaped by wrapping with single quotes.
       * * The duration will be converted to the set of units in the format string using {@link Duration#shiftTo} and the Durations's conversion accuracy setting.
       * @param {string} fmt - the format string
       * @param {Object} opts - options
       * @param {boolean} [opts.floor=true] - floor numerical values
       * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toFormat("y d s") //=> "1 6 2"
       * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toFormat("yy dd sss") //=> "01 06 002"
       * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toFormat("M S") //=> "12 518402000"
       * @return {string}
       */
      toFormat(fmt, opts = {}) {
        // reverse-compat since 1.2; we always round down now, never up, and we do it by default
        const fmtOpts = {
          ...opts,
          floor: opts.round !== false && opts.floor !== false,
        };
        return this.isValid
          ? Formatter.create(this.loc, fmtOpts).formatDurationFromString(this, fmt)
          : INVALID$2;
      }

      /**
       * Returns a string representation of a Duration with all units included.
       * To modify its behavior, use `listStyle` and any Intl.NumberFormat option, though `unitDisplay` is especially relevant.
       * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#options
       * @param {Object} opts - Formatting options. Accepts the same keys as the options parameter of the native `Intl.NumberFormat` constructor, as well as `listStyle`.
       * @param {string} [opts.listStyle='narrow'] - How to format the merged list. Corresponds to the `style` property of the options parameter of the native `Intl.ListFormat` constructor.
       * @example
       * ```js
       * var dur = Duration.fromObject({ days: 1, hours: 5, minutes: 6 })
       * dur.toHuman() //=> '1 day, 5 hours, 6 minutes'
       * dur.toHuman({ listStyle: "long" }) //=> '1 day, 5 hours, and 6 minutes'
       * dur.toHuman({ unitDisplay: "short" }) //=> '1 day, 5 hr, 6 min'
       * ```
       */
      toHuman(opts = {}) {
        if (!this.isValid) return INVALID$2;

        const l = orderedUnits$1
          .map((unit) => {
            const val = this.values[unit];
            if (isUndefined(val)) {
              return null;
            }
            return this.loc
              .numberFormatter({ style: "unit", unitDisplay: "long", ...opts, unit: unit.slice(0, -1) })
              .format(val);
          })
          .filter((n) => n);

        return this.loc
          .listFormatter({ type: "conjunction", style: opts.listStyle || "narrow", ...opts })
          .format(l);
      }

      /**
       * Returns a JavaScript object with this Duration's values.
       * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toObject() //=> { years: 1, days: 6, seconds: 2 }
       * @return {Object}
       */
      toObject() {
        if (!this.isValid) return {};
        return { ...this.values };
      }

      /**
       * Returns an ISO 8601-compliant string representation of this Duration.
       * @see https://en.wikipedia.org/wiki/ISO_8601#Durations
       * @example Duration.fromObject({ years: 3, seconds: 45 }).toISO() //=> 'P3YT45S'
       * @example Duration.fromObject({ months: 4, seconds: 45 }).toISO() //=> 'P4MT45S'
       * @example Duration.fromObject({ months: 5 }).toISO() //=> 'P5M'
       * @example Duration.fromObject({ minutes: 5 }).toISO() //=> 'PT5M'
       * @example Duration.fromObject({ milliseconds: 6 }).toISO() //=> 'PT0.006S'
       * @return {string}
       */
      toISO() {
        // we could use the formatter, but this is an easier way to get the minimum string
        if (!this.isValid) return null;

        let s = "P";
        if (this.years !== 0) s += this.years + "Y";
        if (this.months !== 0 || this.quarters !== 0) s += this.months + this.quarters * 3 + "M";
        if (this.weeks !== 0) s += this.weeks + "W";
        if (this.days !== 0) s += this.days + "D";
        if (this.hours !== 0 || this.minutes !== 0 || this.seconds !== 0 || this.milliseconds !== 0)
          s += "T";
        if (this.hours !== 0) s += this.hours + "H";
        if (this.minutes !== 0) s += this.minutes + "M";
        if (this.seconds !== 0 || this.milliseconds !== 0)
          // this will handle "floating point madness" by removing extra decimal places
          // https://stackoverflow.com/questions/588004/is-floating-point-math-broken
          s += roundTo(this.seconds + this.milliseconds / 1000, 3) + "S";
        if (s === "P") s += "T0S";
        return s;
      }

      /**
       * Returns an ISO 8601-compliant string representation of this Duration, formatted as a time of day.
       * Note that this will return null if the duration is invalid, negative, or equal to or greater than 24 hours.
       * @see https://en.wikipedia.org/wiki/ISO_8601#Times
       * @param {Object} opts - options
       * @param {boolean} [opts.suppressMilliseconds=false] - exclude milliseconds from the format if they're 0
       * @param {boolean} [opts.suppressSeconds=false] - exclude seconds from the format if they're 0
       * @param {boolean} [opts.includePrefix=false] - include the `T` prefix
       * @param {string} [opts.format='extended'] - choose between the basic and extended format
       * @example Duration.fromObject({ hours: 11 }).toISOTime() //=> '11:00:00.000'
       * @example Duration.fromObject({ hours: 11 }).toISOTime({ suppressMilliseconds: true }) //=> '11:00:00'
       * @example Duration.fromObject({ hours: 11 }).toISOTime({ suppressSeconds: true }) //=> '11:00'
       * @example Duration.fromObject({ hours: 11 }).toISOTime({ includePrefix: true }) //=> 'T11:00:00.000'
       * @example Duration.fromObject({ hours: 11 }).toISOTime({ format: 'basic' }) //=> '110000.000'
       * @return {string}
       */
      toISOTime(opts = {}) {
        if (!this.isValid) return null;

        const millis = this.toMillis();
        if (millis < 0 || millis >= 86400000) return null;

        opts = {
          suppressMilliseconds: false,
          suppressSeconds: false,
          includePrefix: false,
          format: "extended",
          ...opts,
          includeOffset: false,
        };

        const dateTime = DateTime.fromMillis(millis, { zone: "UTC" });
        return dateTime.toISOTime(opts);
      }

      /**
       * Returns an ISO 8601 representation of this Duration appropriate for use in JSON.
       * @return {string}
       */
      toJSON() {
        return this.toISO();
      }

      /**
       * Returns an ISO 8601 representation of this Duration appropriate for use in debugging.
       * @return {string}
       */
      toString() {
        return this.toISO();
      }

      /**
       * Returns a string representation of this Duration appropriate for the REPL.
       * @return {string}
       */
      [Symbol.for("nodejs.util.inspect.custom")]() {
        if (this.isValid) {
          return `Duration { values: ${JSON.stringify(this.values)} }`;
        } else {
          return `Duration { Invalid, reason: ${this.invalidReason} }`;
        }
      }

      /**
       * Returns an milliseconds value of this Duration.
       * @return {number}
       */
      toMillis() {
        if (!this.isValid) return NaN;

        return durationToMillis(this.matrix, this.values);
      }

      /**
       * Returns an milliseconds value of this Duration. Alias of {@link toMillis}
       * @return {number}
       */
      valueOf() {
        return this.toMillis();
      }

      /**
       * Make this Duration longer by the specified amount. Return a newly-constructed Duration.
       * @param {Duration|Object|number} duration - The amount to add. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
       * @return {Duration}
       */
      plus(duration) {
        if (!this.isValid) return this;

        const dur = Duration.fromDurationLike(duration),
          result = {};

        for (const k of orderedUnits$1) {
          if (hasOwnProperty(dur.values, k) || hasOwnProperty(this.values, k)) {
            result[k] = dur.get(k) + this.get(k);
          }
        }

        return clone$1(this, { values: result }, true);
      }

      /**
       * Make this Duration shorter by the specified amount. Return a newly-constructed Duration.
       * @param {Duration|Object|number} duration - The amount to subtract. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
       * @return {Duration}
       */
      minus(duration) {
        if (!this.isValid) return this;

        const dur = Duration.fromDurationLike(duration);
        return this.plus(dur.negate());
      }

      /**
       * Scale this Duration by the specified amount. Return a newly-constructed Duration.
       * @param {function} fn - The function to apply to each unit. Arity is 1 or 2: the value of the unit and, optionally, the unit name. Must return a number.
       * @example Duration.fromObject({ hours: 1, minutes: 30 }).mapUnits(x => x * 2) //=> { hours: 2, minutes: 60 }
       * @example Duration.fromObject({ hours: 1, minutes: 30 }).mapUnits((x, u) => u === "hours" ? x * 2 : x) //=> { hours: 2, minutes: 30 }
       * @return {Duration}
       */
      mapUnits(fn) {
        if (!this.isValid) return this;
        const result = {};
        for (const k of Object.keys(this.values)) {
          result[k] = asNumber(fn(this.values[k], k));
        }
        return clone$1(this, { values: result }, true);
      }

      /**
       * Get the value of unit.
       * @param {string} unit - a unit such as 'minute' or 'day'
       * @example Duration.fromObject({years: 2, days: 3}).get('years') //=> 2
       * @example Duration.fromObject({years: 2, days: 3}).get('months') //=> 0
       * @example Duration.fromObject({years: 2, days: 3}).get('days') //=> 3
       * @return {number}
       */
      get(unit) {
        return this[Duration.normalizeUnit(unit)];
      }

      /**
       * "Set" the values of specified units. Return a newly-constructed Duration.
       * @param {Object} values - a mapping of units to numbers
       * @example dur.set({ years: 2017 })
       * @example dur.set({ hours: 8, minutes: 30 })
       * @return {Duration}
       */
      set(values) {
        if (!this.isValid) return this;

        const mixed = { ...this.values, ...normalizeObject(values, Duration.normalizeUnit) };
        return clone$1(this, { values: mixed });
      }

      /**
       * "Set" the locale and/or numberingSystem.  Returns a newly-constructed Duration.
       * @example dur.reconfigure({ locale: 'en-GB' })
       * @return {Duration}
       */
      reconfigure({ locale, numberingSystem, conversionAccuracy, matrix } = {}) {
        const loc = this.loc.clone({ locale, numberingSystem });
        const opts = { loc, matrix, conversionAccuracy };
        return clone$1(this, opts);
      }

      /**
       * Return the length of the duration in the specified unit.
       * @param {string} unit - a unit such as 'minutes' or 'days'
       * @example Duration.fromObject({years: 1}).as('days') //=> 365
       * @example Duration.fromObject({years: 1}).as('months') //=> 12
       * @example Duration.fromObject({hours: 60}).as('days') //=> 2.5
       * @return {number}
       */
      as(unit) {
        return this.isValid ? this.shiftTo(unit).get(unit) : NaN;
      }

      /**
       * Reduce this Duration to its canonical representation in its current units.
       * Assuming the overall value of the Duration is positive, this means:
       * - excessive values for lower-order units are converted to higher-order units (if possible, see first and second example)
       * - negative lower-order units are converted to higher order units (there must be such a higher order unit, otherwise
       *   the overall value would be negative, see third example)
       * - fractional values for higher-order units are converted to lower-order units (if possible, see fourth example)
       *
       * If the overall value is negative, the result of this method is equivalent to `this.negate().normalize().negate()`.
       * @example Duration.fromObject({ years: 2, days: 5000 }).normalize().toObject() //=> { years: 15, days: 255 }
       * @example Duration.fromObject({ days: 5000 }).normalize().toObject() //=> { days: 5000 }
       * @example Duration.fromObject({ hours: 12, minutes: -45 }).normalize().toObject() //=> { hours: 11, minutes: 15 }
       * @example Duration.fromObject({ years: 2.5, days: 0, hours: 0 }).normalize().toObject() //=> { years: 2, days: 182, hours: 12 }
       * @return {Duration}
       */
      normalize() {
        if (!this.isValid) return this;
        const vals = this.toObject();
        normalizeValues(this.matrix, vals);
        return clone$1(this, { values: vals }, true);
      }

      /**
       * Rescale units to its largest representation
       * @example Duration.fromObject({ milliseconds: 90000 }).rescale().toObject() //=> { minutes: 1, seconds: 30 }
       * @return {Duration}
       */
      rescale() {
        if (!this.isValid) return this;
        const vals = removeZeroes(this.normalize().shiftToAll().toObject());
        return clone$1(this, { values: vals }, true);
      }

      /**
       * Convert this Duration into its representation in a different set of units.
       * @example Duration.fromObject({ hours: 1, seconds: 30 }).shiftTo('minutes', 'milliseconds').toObject() //=> { minutes: 60, milliseconds: 30000 }
       * @return {Duration}
       */
      shiftTo(...units) {
        if (!this.isValid) return this;

        if (units.length === 0) {
          return this;
        }

        units = units.map((u) => Duration.normalizeUnit(u));

        const built = {},
          accumulated = {},
          vals = this.toObject();
        let lastUnit;

        for (const k of orderedUnits$1) {
          if (units.indexOf(k) >= 0) {
            lastUnit = k;

            let own = 0;

            // anything we haven't boiled down yet should get boiled to this unit
            for (const ak in accumulated) {
              own += this.matrix[ak][k] * accumulated[ak];
              accumulated[ak] = 0;
            }

            // plus anything that's already in this unit
            if (isNumber(vals[k])) {
              own += vals[k];
            }

            // only keep the integer part for now in the hopes of putting any decimal part
            // into a smaller unit later
            const i = Math.trunc(own);
            built[k] = i;
            accumulated[k] = (own * 1000 - i * 1000) / 1000;

            // otherwise, keep it in the wings to boil it later
          } else if (isNumber(vals[k])) {
            accumulated[k] = vals[k];
          }
        }

        // anything leftover becomes the decimal for the last unit
        // lastUnit must be defined since units is not empty
        for (const key in accumulated) {
          if (accumulated[key] !== 0) {
            built[lastUnit] +=
              key === lastUnit ? accumulated[key] : accumulated[key] / this.matrix[lastUnit][key];
          }
        }

        normalizeValues(this.matrix, built);
        return clone$1(this, { values: built }, true);
      }

      /**
       * Shift this Duration to all available units.
       * Same as shiftTo("years", "months", "weeks", "days", "hours", "minutes", "seconds", "milliseconds")
       * @return {Duration}
       */
      shiftToAll() {
        if (!this.isValid) return this;
        return this.shiftTo(
          "years",
          "months",
          "weeks",
          "days",
          "hours",
          "minutes",
          "seconds",
          "milliseconds"
        );
      }

      /**
       * Return the negative of this Duration.
       * @example Duration.fromObject({ hours: 1, seconds: 30 }).negate().toObject() //=> { hours: -1, seconds: -30 }
       * @return {Duration}
       */
      negate() {
        if (!this.isValid) return this;
        const negated = {};
        for (const k of Object.keys(this.values)) {
          negated[k] = this.values[k] === 0 ? 0 : -this.values[k];
        }
        return clone$1(this, { values: negated }, true);
      }

      /**
       * Get the years.
       * @type {number}
       */
      get years() {
        return this.isValid ? this.values.years || 0 : NaN;
      }

      /**
       * Get the quarters.
       * @type {number}
       */
      get quarters() {
        return this.isValid ? this.values.quarters || 0 : NaN;
      }

      /**
       * Get the months.
       * @type {number}
       */
      get months() {
        return this.isValid ? this.values.months || 0 : NaN;
      }

      /**
       * Get the weeks
       * @type {number}
       */
      get weeks() {
        return this.isValid ? this.values.weeks || 0 : NaN;
      }

      /**
       * Get the days.
       * @type {number}
       */
      get days() {
        return this.isValid ? this.values.days || 0 : NaN;
      }

      /**
       * Get the hours.
       * @type {number}
       */
      get hours() {
        return this.isValid ? this.values.hours || 0 : NaN;
      }

      /**
       * Get the minutes.
       * @type {number}
       */
      get minutes() {
        return this.isValid ? this.values.minutes || 0 : NaN;
      }

      /**
       * Get the seconds.
       * @return {number}
       */
      get seconds() {
        return this.isValid ? this.values.seconds || 0 : NaN;
      }

      /**
       * Get the milliseconds.
       * @return {number}
       */
      get milliseconds() {
        return this.isValid ? this.values.milliseconds || 0 : NaN;
      }

      /**
       * Returns whether the Duration is invalid. Invalid durations are returned by diff operations
       * on invalid DateTimes or Intervals.
       * @return {boolean}
       */
      get isValid() {
        return this.invalid === null;
      }

      /**
       * Returns an error code if this Duration became invalid, or null if the Duration is valid
       * @return {string}
       */
      get invalidReason() {
        return this.invalid ? this.invalid.reason : null;
      }

      /**
       * Returns an explanation of why this Duration became invalid, or null if the Duration is valid
       * @type {string}
       */
      get invalidExplanation() {
        return this.invalid ? this.invalid.explanation : null;
      }

      /**
       * Equality check
       * Two Durations are equal iff they have the same units and the same values for each unit.
       * @param {Duration} other
       * @return {boolean}
       */
      equals(other) {
        if (!this.isValid || !other.isValid) {
          return false;
        }

        if (!this.loc.equals(other.loc)) {
          return false;
        }

        function eq(v1, v2) {
          // Consider 0 and undefined as equal
          if (v1 === undefined || v1 === 0) return v2 === undefined || v2 === 0;
          return v1 === v2;
        }

        for (const u of orderedUnits$1) {
          if (!eq(this.values[u], other.values[u])) {
            return false;
          }
        }
        return true;
      }
    }

    const INVALID$1 = "Invalid Interval";

    // checks if the start is equal to or before the end
    function validateStartEnd(start, end) {
      if (!start || !start.isValid) {
        return Interval.invalid("missing or invalid start");
      } else if (!end || !end.isValid) {
        return Interval.invalid("missing or invalid end");
      } else if (end < start) {
        return Interval.invalid(
          "end before start",
          `The end of an interval must be after its start, but you had start=${start.toISO()} and end=${end.toISO()}`
        );
      } else {
        return null;
      }
    }

    /**
     * An Interval object represents a half-open interval of time, where each endpoint is a {@link DateTime}. Conceptually, it's a container for those two endpoints, accompanied by methods for creating, parsing, interrogating, comparing, transforming, and formatting them.
     *
     * Here is a brief overview of the most commonly used methods and getters in Interval:
     *
     * * **Creation** To create an Interval, use {@link Interval.fromDateTimes}, {@link Interval.after}, {@link Interval.before}, or {@link Interval.fromISO}.
     * * **Accessors** Use {@link Interval#start} and {@link Interval#end} to get the start and end.
     * * **Interrogation** To analyze the Interval, use {@link Interval#count}, {@link Interval#length}, {@link Interval#hasSame}, {@link Interval#contains}, {@link Interval#isAfter}, or {@link Interval#isBefore}.
     * * **Transformation** To create other Intervals out of this one, use {@link Interval#set}, {@link Interval#splitAt}, {@link Interval#splitBy}, {@link Interval#divideEqually}, {@link Interval.merge}, {@link Interval.xor}, {@link Interval#union}, {@link Interval#intersection}, or {@link Interval#difference}.
     * * **Comparison** To compare this Interval to another one, use {@link Interval#equals}, {@link Interval#overlaps}, {@link Interval#abutsStart}, {@link Interval#abutsEnd}, {@link Interval#engulfs}
     * * **Output** To convert the Interval into other representations, see {@link Interval#toString}, {@link Interval#toLocaleString}, {@link Interval#toISO}, {@link Interval#toISODate}, {@link Interval#toISOTime}, {@link Interval#toFormat}, and {@link Interval#toDuration}.
     */
    class Interval {
      /**
       * @private
       */
      constructor(config) {
        /**
         * @access private
         */
        this.s = config.start;
        /**
         * @access private
         */
        this.e = config.end;
        /**
         * @access private
         */
        this.invalid = config.invalid || null;
        /**
         * @access private
         */
        this.isLuxonInterval = true;
      }

      /**
       * Create an invalid Interval.
       * @param {string} reason - simple string of why this Interval is invalid. Should not contain parameters or anything else data-dependent
       * @param {string} [explanation=null] - longer explanation, may include parameters and other useful debugging information
       * @return {Interval}
       */
      static invalid(reason, explanation = null) {
        if (!reason) {
          throw new InvalidArgumentError("need to specify a reason the Interval is invalid");
        }

        const invalid = reason instanceof Invalid ? reason : new Invalid(reason, explanation);

        if (Settings.throwOnInvalid) {
          throw new InvalidIntervalError(invalid);
        } else {
          return new Interval({ invalid });
        }
      }

      /**
       * Create an Interval from a start DateTime and an end DateTime. Inclusive of the start but not the end.
       * @param {DateTime|Date|Object} start
       * @param {DateTime|Date|Object} end
       * @return {Interval}
       */
      static fromDateTimes(start, end) {
        const builtStart = friendlyDateTime(start),
          builtEnd = friendlyDateTime(end);

        const validateError = validateStartEnd(builtStart, builtEnd);

        if (validateError == null) {
          return new Interval({
            start: builtStart,
            end: builtEnd,
          });
        } else {
          return validateError;
        }
      }

      /**
       * Create an Interval from a start DateTime and a Duration to extend to.
       * @param {DateTime|Date|Object} start
       * @param {Duration|Object|number} duration - the length of the Interval.
       * @return {Interval}
       */
      static after(start, duration) {
        const dur = Duration.fromDurationLike(duration),
          dt = friendlyDateTime(start);
        return Interval.fromDateTimes(dt, dt.plus(dur));
      }

      /**
       * Create an Interval from an end DateTime and a Duration to extend backwards to.
       * @param {DateTime|Date|Object} end
       * @param {Duration|Object|number} duration - the length of the Interval.
       * @return {Interval}
       */
      static before(end, duration) {
        const dur = Duration.fromDurationLike(duration),
          dt = friendlyDateTime(end);
        return Interval.fromDateTimes(dt.minus(dur), dt);
      }

      /**
       * Create an Interval from an ISO 8601 string.
       * Accepts `<start>/<end>`, `<start>/<duration>`, and `<duration>/<end>` formats.
       * @param {string} text - the ISO string to parse
       * @param {Object} [opts] - options to pass {@link DateTime#fromISO} and optionally {@link Duration#fromISO}
       * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
       * @return {Interval}
       */
      static fromISO(text, opts) {
        const [s, e] = (text || "").split("/", 2);
        if (s && e) {
          let start, startIsValid;
          try {
            start = DateTime.fromISO(s, opts);
            startIsValid = start.isValid;
          } catch (e) {
            startIsValid = false;
          }

          let end, endIsValid;
          try {
            end = DateTime.fromISO(e, opts);
            endIsValid = end.isValid;
          } catch (e) {
            endIsValid = false;
          }

          if (startIsValid && endIsValid) {
            return Interval.fromDateTimes(start, end);
          }

          if (startIsValid) {
            const dur = Duration.fromISO(e, opts);
            if (dur.isValid) {
              return Interval.after(start, dur);
            }
          } else if (endIsValid) {
            const dur = Duration.fromISO(s, opts);
            if (dur.isValid) {
              return Interval.before(end, dur);
            }
          }
        }
        return Interval.invalid("unparsable", `the input "${text}" can't be parsed as ISO 8601`);
      }

      /**
       * Check if an object is an Interval. Works across context boundaries
       * @param {object} o
       * @return {boolean}
       */
      static isInterval(o) {
        return (o && o.isLuxonInterval) || false;
      }

      /**
       * Returns the start of the Interval
       * @type {DateTime}
       */
      get start() {
        return this.isValid ? this.s : null;
      }

      /**
       * Returns the end of the Interval
       * @type {DateTime}
       */
      get end() {
        return this.isValid ? this.e : null;
      }

      /**
       * Returns the last DateTime included in the interval (since end is not part of the interval)
       * @type {DateTime}
       */
      get lastDateTime() {
        return this.isValid ? (this.e ? this.e.minus(1) : null) : null;
      }

      /**
       * Returns whether this Interval's end is at least its start, meaning that the Interval isn't 'backwards'.
       * @type {boolean}
       */
      get isValid() {
        return this.invalidReason === null;
      }

      /**
       * Returns an error code if this Interval is invalid, or null if the Interval is valid
       * @type {string}
       */
      get invalidReason() {
        return this.invalid ? this.invalid.reason : null;
      }

      /**
       * Returns an explanation of why this Interval became invalid, or null if the Interval is valid
       * @type {string}
       */
      get invalidExplanation() {
        return this.invalid ? this.invalid.explanation : null;
      }

      /**
       * Returns the length of the Interval in the specified unit.
       * @param {string} unit - the unit (such as 'hours' or 'days') to return the length in.
       * @return {number}
       */
      length(unit = "milliseconds") {
        return this.isValid ? this.toDuration(...[unit]).get(unit) : NaN;
      }

      /**
       * Returns the count of minutes, hours, days, months, or years included in the Interval, even in part.
       * Unlike {@link Interval#length} this counts sections of the calendar, not periods of time, e.g. specifying 'day'
       * asks 'what dates are included in this interval?', not 'how many days long is this interval?'
       * @param {string} [unit='milliseconds'] - the unit of time to count.
       * @param {Object} opts - options
       * @param {boolean} [opts.useLocaleWeeks=false] - If true, use weeks based on the locale, i.e. use the locale-dependent start of the week; this operation will always use the locale of the start DateTime
       * @return {number}
       */
      count(unit = "milliseconds", opts) {
        if (!this.isValid) return NaN;
        const start = this.start.startOf(unit, opts);
        let end;
        if (opts?.useLocaleWeeks) {
          end = this.end.reconfigure({ locale: start.locale });
        } else {
          end = this.end;
        }
        end = end.startOf(unit, opts);
        return Math.floor(end.diff(start, unit).get(unit)) + (end.valueOf() !== this.end.valueOf());
      }

      /**
       * Returns whether this Interval's start and end are both in the same unit of time
       * @param {string} unit - the unit of time to check sameness on
       * @return {boolean}
       */
      hasSame(unit) {
        return this.isValid ? this.isEmpty() || this.e.minus(1).hasSame(this.s, unit) : false;
      }

      /**
       * Return whether this Interval has the same start and end DateTimes.
       * @return {boolean}
       */
      isEmpty() {
        return this.s.valueOf() === this.e.valueOf();
      }

      /**
       * Return whether this Interval's start is after the specified DateTime.
       * @param {DateTime} dateTime
       * @return {boolean}
       */
      isAfter(dateTime) {
        if (!this.isValid) return false;
        return this.s > dateTime;
      }

      /**
       * Return whether this Interval's end is before the specified DateTime.
       * @param {DateTime} dateTime
       * @return {boolean}
       */
      isBefore(dateTime) {
        if (!this.isValid) return false;
        return this.e <= dateTime;
      }

      /**
       * Return whether this Interval contains the specified DateTime.
       * @param {DateTime} dateTime
       * @return {boolean}
       */
      contains(dateTime) {
        if (!this.isValid) return false;
        return this.s <= dateTime && this.e > dateTime;
      }

      /**
       * "Sets" the start and/or end dates. Returns a newly-constructed Interval.
       * @param {Object} values - the values to set
       * @param {DateTime} values.start - the starting DateTime
       * @param {DateTime} values.end - the ending DateTime
       * @return {Interval}
       */
      set({ start, end } = {}) {
        if (!this.isValid) return this;
        return Interval.fromDateTimes(start || this.s, end || this.e);
      }

      /**
       * Split this Interval at each of the specified DateTimes
       * @param {...DateTime} dateTimes - the unit of time to count.
       * @return {Array}
       */
      splitAt(...dateTimes) {
        if (!this.isValid) return [];
        const sorted = dateTimes
            .map(friendlyDateTime)
            .filter((d) => this.contains(d))
            .sort((a, b) => a.toMillis() - b.toMillis()),
          results = [];
        let { s } = this,
          i = 0;

        while (s < this.e) {
          const added = sorted[i] || this.e,
            next = +added > +this.e ? this.e : added;
          results.push(Interval.fromDateTimes(s, next));
          s = next;
          i += 1;
        }

        return results;
      }

      /**
       * Split this Interval into smaller Intervals, each of the specified length.
       * Left over time is grouped into a smaller interval
       * @param {Duration|Object|number} duration - The length of each resulting interval.
       * @return {Array}
       */
      splitBy(duration) {
        const dur = Duration.fromDurationLike(duration);

        if (!this.isValid || !dur.isValid || dur.as("milliseconds") === 0) {
          return [];
        }

        let { s } = this,
          idx = 1,
          next;

        const results = [];
        while (s < this.e) {
          const added = this.start.plus(dur.mapUnits((x) => x * idx));
          next = +added > +this.e ? this.e : added;
          results.push(Interval.fromDateTimes(s, next));
          s = next;
          idx += 1;
        }

        return results;
      }

      /**
       * Split this Interval into the specified number of smaller intervals.
       * @param {number} numberOfParts - The number of Intervals to divide the Interval into.
       * @return {Array}
       */
      divideEqually(numberOfParts) {
        if (!this.isValid) return [];
        return this.splitBy(this.length() / numberOfParts).slice(0, numberOfParts);
      }

      /**
       * Return whether this Interval overlaps with the specified Interval
       * @param {Interval} other
       * @return {boolean}
       */
      overlaps(other) {
        return this.e > other.s && this.s < other.e;
      }

      /**
       * Return whether this Interval's end is adjacent to the specified Interval's start.
       * @param {Interval} other
       * @return {boolean}
       */
      abutsStart(other) {
        if (!this.isValid) return false;
        return +this.e === +other.s;
      }

      /**
       * Return whether this Interval's start is adjacent to the specified Interval's end.
       * @param {Interval} other
       * @return {boolean}
       */
      abutsEnd(other) {
        if (!this.isValid) return false;
        return +other.e === +this.s;
      }

      /**
       * Returns true if this Interval fully contains the specified Interval, specifically if the intersect (of this Interval and the other Interval) is equal to the other Interval; false otherwise.
       * @param {Interval} other
       * @return {boolean}
       */
      engulfs(other) {
        if (!this.isValid) return false;
        return this.s <= other.s && this.e >= other.e;
      }

      /**
       * Return whether this Interval has the same start and end as the specified Interval.
       * @param {Interval} other
       * @return {boolean}
       */
      equals(other) {
        if (!this.isValid || !other.isValid) {
          return false;
        }

        return this.s.equals(other.s) && this.e.equals(other.e);
      }

      /**
       * Return an Interval representing the intersection of this Interval and the specified Interval.
       * Specifically, the resulting Interval has the maximum start time and the minimum end time of the two Intervals.
       * Returns null if the intersection is empty, meaning, the intervals don't intersect.
       * @param {Interval} other
       * @return {Interval}
       */
      intersection(other) {
        if (!this.isValid) return this;
        const s = this.s > other.s ? this.s : other.s,
          e = this.e < other.e ? this.e : other.e;

        if (s >= e) {
          return null;
        } else {
          return Interval.fromDateTimes(s, e);
        }
      }

      /**
       * Return an Interval representing the union of this Interval and the specified Interval.
       * Specifically, the resulting Interval has the minimum start time and the maximum end time of the two Intervals.
       * @param {Interval} other
       * @return {Interval}
       */
      union(other) {
        if (!this.isValid) return this;
        const s = this.s < other.s ? this.s : other.s,
          e = this.e > other.e ? this.e : other.e;
        return Interval.fromDateTimes(s, e);
      }

      /**
       * Merge an array of Intervals into a equivalent minimal set of Intervals.
       * Combines overlapping and adjacent Intervals.
       * @param {Array} intervals
       * @return {Array}
       */
      static merge(intervals) {
        const [found, final] = intervals
          .sort((a, b) => a.s - b.s)
          .reduce(
            ([sofar, current], item) => {
              if (!current) {
                return [sofar, item];
              } else if (current.overlaps(item) || current.abutsStart(item)) {
                return [sofar, current.union(item)];
              } else {
                return [sofar.concat([current]), item];
              }
            },
            [[], null]
          );
        if (final) {
          found.push(final);
        }
        return found;
      }

      /**
       * Return an array of Intervals representing the spans of time that only appear in one of the specified Intervals.
       * @param {Array} intervals
       * @return {Array}
       */
      static xor(intervals) {
        let start = null,
          currentCount = 0;
        const results = [],
          ends = intervals.map((i) => [
            { time: i.s, type: "s" },
            { time: i.e, type: "e" },
          ]),
          flattened = Array.prototype.concat(...ends),
          arr = flattened.sort((a, b) => a.time - b.time);

        for (const i of arr) {
          currentCount += i.type === "s" ? 1 : -1;

          if (currentCount === 1) {
            start = i.time;
          } else {
            if (start && +start !== +i.time) {
              results.push(Interval.fromDateTimes(start, i.time));
            }

            start = null;
          }
        }

        return Interval.merge(results);
      }

      /**
       * Return an Interval representing the span of time in this Interval that doesn't overlap with any of the specified Intervals.
       * @param {...Interval} intervals
       * @return {Array}
       */
      difference(...intervals) {
        return Interval.xor([this].concat(intervals))
          .map((i) => this.intersection(i))
          .filter((i) => i && !i.isEmpty());
      }

      /**
       * Returns a string representation of this Interval appropriate for debugging.
       * @return {string}
       */
      toString() {
        if (!this.isValid) return INVALID$1;
        return `[${this.s.toISO()} – ${this.e.toISO()})`;
      }

      /**
       * Returns a string representation of this Interval appropriate for the REPL.
       * @return {string}
       */
      [Symbol.for("nodejs.util.inspect.custom")]() {
        if (this.isValid) {
          return `Interval { start: ${this.s.toISO()}, end: ${this.e.toISO()} }`;
        } else {
          return `Interval { Invalid, reason: ${this.invalidReason} }`;
        }
      }

      /**
       * Returns a localized string representing this Interval. Accepts the same options as the
       * Intl.DateTimeFormat constructor and any presets defined by Luxon, such as
       * {@link DateTime.DATE_FULL} or {@link DateTime.TIME_SIMPLE}. The exact behavior of this method
       * is browser-specific, but in general it will return an appropriate representation of the
       * Interval in the assigned locale. Defaults to the system's locale if no locale has been
       * specified.
       * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
       * @param {Object} [formatOpts=DateTime.DATE_SHORT] - Either a DateTime preset or
       * Intl.DateTimeFormat constructor options.
       * @param {Object} opts - Options to override the configuration of the start DateTime.
       * @example Interval.fromISO('2022-11-07T09:00Z/2022-11-08T09:00Z').toLocaleString(); //=> 11/7/2022 – 11/8/2022
       * @example Interval.fromISO('2022-11-07T09:00Z/2022-11-08T09:00Z').toLocaleString(DateTime.DATE_FULL); //=> November 7 – 8, 2022
       * @example Interval.fromISO('2022-11-07T09:00Z/2022-11-08T09:00Z').toLocaleString(DateTime.DATE_FULL, { locale: 'fr-FR' }); //=> 7–8 novembre 2022
       * @example Interval.fromISO('2022-11-07T17:00Z/2022-11-07T19:00Z').toLocaleString(DateTime.TIME_SIMPLE); //=> 6:00 – 8:00 PM
       * @example Interval.fromISO('2022-11-07T17:00Z/2022-11-07T19:00Z').toLocaleString({ weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }); //=> Mon, Nov 07, 6:00 – 8:00 p
       * @return {string}
       */
      toLocaleString(formatOpts = DATE_SHORT, opts = {}) {
        return this.isValid
          ? Formatter.create(this.s.loc.clone(opts), formatOpts).formatInterval(this)
          : INVALID$1;
      }

      /**
       * Returns an ISO 8601-compliant string representation of this Interval.
       * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
       * @param {Object} opts - The same options as {@link DateTime#toISO}
       * @return {string}
       */
      toISO(opts) {
        if (!this.isValid) return INVALID$1;
        return `${this.s.toISO(opts)}/${this.e.toISO(opts)}`;
      }

      /**
       * Returns an ISO 8601-compliant string representation of date of this Interval.
       * The time components are ignored.
       * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
       * @return {string}
       */
      toISODate() {
        if (!this.isValid) return INVALID$1;
        return `${this.s.toISODate()}/${this.e.toISODate()}`;
      }

      /**
       * Returns an ISO 8601-compliant string representation of time of this Interval.
       * The date components are ignored.
       * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
       * @param {Object} opts - The same options as {@link DateTime#toISO}
       * @return {string}
       */
      toISOTime(opts) {
        if (!this.isValid) return INVALID$1;
        return `${this.s.toISOTime(opts)}/${this.e.toISOTime(opts)}`;
      }

      /**
       * Returns a string representation of this Interval formatted according to the specified format
       * string. **You may not want this.** See {@link Interval#toLocaleString} for a more flexible
       * formatting tool.
       * @param {string} dateFormat - The format string. This string formats the start and end time.
       * See {@link DateTime#toFormat} for details.
       * @param {Object} opts - Options.
       * @param {string} [opts.separator =  ' – '] - A separator to place between the start and end
       * representations.
       * @return {string}
       */
      toFormat(dateFormat, { separator = " – " } = {}) {
        if (!this.isValid) return INVALID$1;
        return `${this.s.toFormat(dateFormat)}${separator}${this.e.toFormat(dateFormat)}`;
      }

      /**
       * Return a Duration representing the time spanned by this interval.
       * @param {string|string[]} [unit=['milliseconds']] - the unit or units (such as 'hours' or 'days') to include in the duration.
       * @param {Object} opts - options that affect the creation of the Duration
       * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
       * @example Interval.fromDateTimes(dt1, dt2).toDuration().toObject() //=> { milliseconds: 88489257 }
       * @example Interval.fromDateTimes(dt1, dt2).toDuration('days').toObject() //=> { days: 1.0241812152777778 }
       * @example Interval.fromDateTimes(dt1, dt2).toDuration(['hours', 'minutes']).toObject() //=> { hours: 24, minutes: 34.82095 }
       * @example Interval.fromDateTimes(dt1, dt2).toDuration(['hours', 'minutes', 'seconds']).toObject() //=> { hours: 24, minutes: 34, seconds: 49.257 }
       * @example Interval.fromDateTimes(dt1, dt2).toDuration('seconds').toObject() //=> { seconds: 88489.257 }
       * @return {Duration}
       */
      toDuration(unit, opts) {
        if (!this.isValid) {
          return Duration.invalid(this.invalidReason);
        }
        return this.e.diff(this.s, unit, opts);
      }

      /**
       * Run mapFn on the interval start and end, returning a new Interval from the resulting DateTimes
       * @param {function} mapFn
       * @return {Interval}
       * @example Interval.fromDateTimes(dt1, dt2).mapEndpoints(endpoint => endpoint.toUTC())
       * @example Interval.fromDateTimes(dt1, dt2).mapEndpoints(endpoint => endpoint.plus({ hours: 2 }))
       */
      mapEndpoints(mapFn) {
        return Interval.fromDateTimes(mapFn(this.s), mapFn(this.e));
      }
    }

    /**
     * The Info class contains static methods for retrieving general time and date related data. For example, it has methods for finding out if a time zone has a DST, for listing the months in any supported locale, and for discovering which of Luxon features are available in the current environment.
     */
    class Info {
      /**
       * Return whether the specified zone contains a DST.
       * @param {string|Zone} [zone='local'] - Zone to check. Defaults to the environment's local zone.
       * @return {boolean}
       */
      static hasDST(zone = Settings.defaultZone) {
        const proto = DateTime.now().setZone(zone).set({ month: 12 });

        return !zone.isUniversal && proto.offset !== proto.set({ month: 6 }).offset;
      }

      /**
       * Return whether the specified zone is a valid IANA specifier.
       * @param {string} zone - Zone to check
       * @return {boolean}
       */
      static isValidIANAZone(zone) {
        return IANAZone.isValidZone(zone);
      }

      /**
       * Converts the input into a {@link Zone} instance.
       *
       * * If `input` is already a Zone instance, it is returned unchanged.
       * * If `input` is a string containing a valid time zone name, a Zone instance
       *   with that name is returned.
       * * If `input` is a string that doesn't refer to a known time zone, a Zone
       *   instance with {@link Zone#isValid} == false is returned.
       * * If `input is a number, a Zone instance with the specified fixed offset
       *   in minutes is returned.
       * * If `input` is `null` or `undefined`, the default zone is returned.
       * @param {string|Zone|number} [input] - the value to be converted
       * @return {Zone}
       */
      static normalizeZone(input) {
        return normalizeZone(input, Settings.defaultZone);
      }

      /**
       * Get the weekday on which the week starts according to the given locale.
       * @param {Object} opts - options
       * @param {string} [opts.locale] - the locale code
       * @param {string} [opts.locObj=null] - an existing locale object to use
       * @returns {number} the start of the week, 1 for Monday through 7 for Sunday
       */
      static getStartOfWeek({ locale = null, locObj = null } = {}) {
        return (locObj || Locale.create(locale)).getStartOfWeek();
      }

      /**
       * Get the minimum number of days necessary in a week before it is considered part of the next year according
       * to the given locale.
       * @param {Object} opts - options
       * @param {string} [opts.locale] - the locale code
       * @param {string} [opts.locObj=null] - an existing locale object to use
       * @returns {number}
       */
      static getMinimumDaysInFirstWeek({ locale = null, locObj = null } = {}) {
        return (locObj || Locale.create(locale)).getMinDaysInFirstWeek();
      }

      /**
       * Get the weekdays, which are considered the weekend according to the given locale
       * @param {Object} opts - options
       * @param {string} [opts.locale] - the locale code
       * @param {string} [opts.locObj=null] - an existing locale object to use
       * @returns {number[]} an array of weekdays, 1 for Monday through 7 for Sunday
       */
      static getWeekendWeekdays({ locale = null, locObj = null } = {}) {
        // copy the array, because we cache it internally
        return (locObj || Locale.create(locale)).getWeekendDays().slice();
      }

      /**
       * Return an array of standalone month names.
       * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
       * @param {string} [length='long'] - the length of the month representation, such as "numeric", "2-digit", "narrow", "short", "long"
       * @param {Object} opts - options
       * @param {string} [opts.locale] - the locale code
       * @param {string} [opts.numberingSystem=null] - the numbering system
       * @param {string} [opts.locObj=null] - an existing locale object to use
       * @param {string} [opts.outputCalendar='gregory'] - the calendar
       * @example Info.months()[0] //=> 'January'
       * @example Info.months('short')[0] //=> 'Jan'
       * @example Info.months('numeric')[0] //=> '1'
       * @example Info.months('short', { locale: 'fr-CA' } )[0] //=> 'janv.'
       * @example Info.months('numeric', { locale: 'ar' })[0] //=> '١'
       * @example Info.months('long', { outputCalendar: 'islamic' })[0] //=> 'Rabiʻ I'
       * @return {Array}
       */
      static months(
        length = "long",
        { locale = null, numberingSystem = null, locObj = null, outputCalendar = "gregory" } = {}
      ) {
        return (locObj || Locale.create(locale, numberingSystem, outputCalendar)).months(length);
      }

      /**
       * Return an array of format month names.
       * Format months differ from standalone months in that they're meant to appear next to the day of the month. In some languages, that
       * changes the string.
       * See {@link Info#months}
       * @param {string} [length='long'] - the length of the month representation, such as "numeric", "2-digit", "narrow", "short", "long"
       * @param {Object} opts - options
       * @param {string} [opts.locale] - the locale code
       * @param {string} [opts.numberingSystem=null] - the numbering system
       * @param {string} [opts.locObj=null] - an existing locale object to use
       * @param {string} [opts.outputCalendar='gregory'] - the calendar
       * @return {Array}
       */
      static monthsFormat(
        length = "long",
        { locale = null, numberingSystem = null, locObj = null, outputCalendar = "gregory" } = {}
      ) {
        return (locObj || Locale.create(locale, numberingSystem, outputCalendar)).months(length, true);
      }

      /**
       * Return an array of standalone week names.
       * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
       * @param {string} [length='long'] - the length of the weekday representation, such as "narrow", "short", "long".
       * @param {Object} opts - options
       * @param {string} [opts.locale] - the locale code
       * @param {string} [opts.numberingSystem=null] - the numbering system
       * @param {string} [opts.locObj=null] - an existing locale object to use
       * @example Info.weekdays()[0] //=> 'Monday'
       * @example Info.weekdays('short')[0] //=> 'Mon'
       * @example Info.weekdays('short', { locale: 'fr-CA' })[0] //=> 'lun.'
       * @example Info.weekdays('short', { locale: 'ar' })[0] //=> 'الاثنين'
       * @return {Array}
       */
      static weekdays(length = "long", { locale = null, numberingSystem = null, locObj = null } = {}) {
        return (locObj || Locale.create(locale, numberingSystem, null)).weekdays(length);
      }

      /**
       * Return an array of format week names.
       * Format weekdays differ from standalone weekdays in that they're meant to appear next to more date information. In some languages, that
       * changes the string.
       * See {@link Info#weekdays}
       * @param {string} [length='long'] - the length of the month representation, such as "narrow", "short", "long".
       * @param {Object} opts - options
       * @param {string} [opts.locale=null] - the locale code
       * @param {string} [opts.numberingSystem=null] - the numbering system
       * @param {string} [opts.locObj=null] - an existing locale object to use
       * @return {Array}
       */
      static weekdaysFormat(
        length = "long",
        { locale = null, numberingSystem = null, locObj = null } = {}
      ) {
        return (locObj || Locale.create(locale, numberingSystem, null)).weekdays(length, true);
      }

      /**
       * Return an array of meridiems.
       * @param {Object} opts - options
       * @param {string} [opts.locale] - the locale code
       * @example Info.meridiems() //=> [ 'AM', 'PM' ]
       * @example Info.meridiems({ locale: 'my' }) //=> [ 'နံနက်', 'ညနေ' ]
       * @return {Array}
       */
      static meridiems({ locale = null } = {}) {
        return Locale.create(locale).meridiems();
      }

      /**
       * Return an array of eras, such as ['BC', 'AD']. The locale can be specified, but the calendar system is always Gregorian.
       * @param {string} [length='short'] - the length of the era representation, such as "short" or "long".
       * @param {Object} opts - options
       * @param {string} [opts.locale] - the locale code
       * @example Info.eras() //=> [ 'BC', 'AD' ]
       * @example Info.eras('long') //=> [ 'Before Christ', 'Anno Domini' ]
       * @example Info.eras('long', { locale: 'fr' }) //=> [ 'avant Jésus-Christ', 'après Jésus-Christ' ]
       * @return {Array}
       */
      static eras(length = "short", { locale = null } = {}) {
        return Locale.create(locale, null, "gregory").eras(length);
      }

      /**
       * Return the set of available features in this environment.
       * Some features of Luxon are not available in all environments. For example, on older browsers, relative time formatting support is not available. Use this function to figure out if that's the case.
       * Keys:
       * * `relative`: whether this environment supports relative time formatting
       * * `localeWeek`: whether this environment supports different weekdays for the start of the week based on the locale
       * @example Info.features() //=> { relative: false, localeWeek: true }
       * @return {Object}
       */
      static features() {
        return { relative: hasRelative(), localeWeek: hasLocaleWeekInfo() };
      }
    }

    function dayDiff(earlier, later) {
      const utcDayStart = (dt) => dt.toUTC(0, { keepLocalTime: true }).startOf("day").valueOf(),
        ms = utcDayStart(later) - utcDayStart(earlier);
      return Math.floor(Duration.fromMillis(ms).as("days"));
    }

    function highOrderDiffs(cursor, later, units) {
      const differs = [
        ["years", (a, b) => b.year - a.year],
        ["quarters", (a, b) => b.quarter - a.quarter + (b.year - a.year) * 4],
        ["months", (a, b) => b.month - a.month + (b.year - a.year) * 12],
        [
          "weeks",
          (a, b) => {
            const days = dayDiff(a, b);
            return (days - (days % 7)) / 7;
          },
        ],
        ["days", dayDiff],
      ];

      const results = {};
      const earlier = cursor;
      let lowestOrder, highWater;

      /* This loop tries to diff using larger units first.
         If we overshoot, we backtrack and try the next smaller unit.
         "cursor" starts out at the earlier timestamp and moves closer and closer to "later"
         as we use smaller and smaller units.
         highWater keeps track of where we would be if we added one more of the smallest unit,
         this is used later to potentially convert any difference smaller than the smallest higher order unit
         into a fraction of that smallest higher order unit
      */
      for (const [unit, differ] of differs) {
        if (units.indexOf(unit) >= 0) {
          lowestOrder = unit;

          results[unit] = differ(cursor, later);
          highWater = earlier.plus(results);

          if (highWater > later) {
            // we overshot the end point, backtrack cursor by 1
            results[unit]--;
            cursor = earlier.plus(results);

            // if we are still overshooting now, we need to backtrack again
            // this happens in certain situations when diffing times in different zones,
            // because this calculation ignores time zones
            if (cursor > later) {
              // keep the "overshot by 1" around as highWater
              highWater = cursor;
              // backtrack cursor by 1
              results[unit]--;
              cursor = earlier.plus(results);
            }
          } else {
            cursor = highWater;
          }
        }
      }

      return [cursor, results, highWater, lowestOrder];
    }

    function diff (earlier, later, units, opts) {
      let [cursor, results, highWater, lowestOrder] = highOrderDiffs(earlier, later, units);

      const remainingMillis = later - cursor;

      const lowerOrderUnits = units.filter(
        (u) => ["hours", "minutes", "seconds", "milliseconds"].indexOf(u) >= 0
      );

      if (lowerOrderUnits.length === 0) {
        if (highWater < later) {
          highWater = cursor.plus({ [lowestOrder]: 1 });
        }

        if (highWater !== cursor) {
          results[lowestOrder] = (results[lowestOrder] || 0) + remainingMillis / (highWater - cursor);
        }
      }

      const duration = Duration.fromObject(results, opts);

      if (lowerOrderUnits.length > 0) {
        return Duration.fromMillis(remainingMillis, opts)
          .shiftTo(...lowerOrderUnits)
          .plus(duration);
      } else {
        return duration;
      }
    }

    const MISSING_FTP = "missing Intl.DateTimeFormat.formatToParts support";

    function intUnit(regex, post = (i) => i) {
      return { regex, deser: ([s]) => post(parseDigits(s)) };
    }

    const NBSP = String.fromCharCode(160);
    const spaceOrNBSP = `[ ${NBSP}]`;
    const spaceOrNBSPRegExp = new RegExp(spaceOrNBSP, "g");

    function fixListRegex(s) {
      // make dots optional and also make them literal
      // make space and non breakable space characters interchangeable
      return s.replace(/\./g, "\\.?").replace(spaceOrNBSPRegExp, spaceOrNBSP);
    }

    function stripInsensitivities(s) {
      return s
        .replace(/\./g, "") // ignore dots that were made optional
        .replace(spaceOrNBSPRegExp, " ") // interchange space and nbsp
        .toLowerCase();
    }

    function oneOf(strings, startIndex) {
      if (strings === null) {
        return null;
      } else {
        return {
          regex: RegExp(strings.map(fixListRegex).join("|")),
          deser: ([s]) =>
            strings.findIndex((i) => stripInsensitivities(s) === stripInsensitivities(i)) + startIndex,
        };
      }
    }

    function offset(regex, groups) {
      return { regex, deser: ([, h, m]) => signedOffset(h, m), groups };
    }

    function simple(regex) {
      return { regex, deser: ([s]) => s };
    }

    function escapeToken(value) {
      return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
    }

    /**
     * @param token
     * @param {Locale} loc
     */
    function unitForToken(token, loc) {
      const one = digitRegex(loc),
        two = digitRegex(loc, "{2}"),
        three = digitRegex(loc, "{3}"),
        four = digitRegex(loc, "{4}"),
        six = digitRegex(loc, "{6}"),
        oneOrTwo = digitRegex(loc, "{1,2}"),
        oneToThree = digitRegex(loc, "{1,3}"),
        oneToSix = digitRegex(loc, "{1,6}"),
        oneToNine = digitRegex(loc, "{1,9}"),
        twoToFour = digitRegex(loc, "{2,4}"),
        fourToSix = digitRegex(loc, "{4,6}"),
        literal = (t) => ({ regex: RegExp(escapeToken(t.val)), deser: ([s]) => s, literal: true }),
        unitate = (t) => {
          if (token.literal) {
            return literal(t);
          }
          switch (t.val) {
            // era
            case "G":
              return oneOf(loc.eras("short"), 0);
            case "GG":
              return oneOf(loc.eras("long"), 0);
            // years
            case "y":
              return intUnit(oneToSix);
            case "yy":
              return intUnit(twoToFour, untruncateYear);
            case "yyyy":
              return intUnit(four);
            case "yyyyy":
              return intUnit(fourToSix);
            case "yyyyyy":
              return intUnit(six);
            // months
            case "M":
              return intUnit(oneOrTwo);
            case "MM":
              return intUnit(two);
            case "MMM":
              return oneOf(loc.months("short", true), 1);
            case "MMMM":
              return oneOf(loc.months("long", true), 1);
            case "L":
              return intUnit(oneOrTwo);
            case "LL":
              return intUnit(two);
            case "LLL":
              return oneOf(loc.months("short", false), 1);
            case "LLLL":
              return oneOf(loc.months("long", false), 1);
            // dates
            case "d":
              return intUnit(oneOrTwo);
            case "dd":
              return intUnit(two);
            // ordinals
            case "o":
              return intUnit(oneToThree);
            case "ooo":
              return intUnit(three);
            // time
            case "HH":
              return intUnit(two);
            case "H":
              return intUnit(oneOrTwo);
            case "hh":
              return intUnit(two);
            case "h":
              return intUnit(oneOrTwo);
            case "mm":
              return intUnit(two);
            case "m":
              return intUnit(oneOrTwo);
            case "q":
              return intUnit(oneOrTwo);
            case "qq":
              return intUnit(two);
            case "s":
              return intUnit(oneOrTwo);
            case "ss":
              return intUnit(two);
            case "S":
              return intUnit(oneToThree);
            case "SSS":
              return intUnit(three);
            case "u":
              return simple(oneToNine);
            case "uu":
              return simple(oneOrTwo);
            case "uuu":
              return intUnit(one);
            // meridiem
            case "a":
              return oneOf(loc.meridiems(), 0);
            // weekYear (k)
            case "kkkk":
              return intUnit(four);
            case "kk":
              return intUnit(twoToFour, untruncateYear);
            // weekNumber (W)
            case "W":
              return intUnit(oneOrTwo);
            case "WW":
              return intUnit(two);
            // weekdays
            case "E":
            case "c":
              return intUnit(one);
            case "EEE":
              return oneOf(loc.weekdays("short", false), 1);
            case "EEEE":
              return oneOf(loc.weekdays("long", false), 1);
            case "ccc":
              return oneOf(loc.weekdays("short", true), 1);
            case "cccc":
              return oneOf(loc.weekdays("long", true), 1);
            // offset/zone
            case "Z":
            case "ZZ":
              return offset(new RegExp(`([+-]${oneOrTwo.source})(?::(${two.source}))?`), 2);
            case "ZZZ":
              return offset(new RegExp(`([+-]${oneOrTwo.source})(${two.source})?`), 2);
            // we don't support ZZZZ (PST) or ZZZZZ (Pacific Standard Time) in parsing
            // because we don't have any way to figure out what they are
            case "z":
              return simple(/[a-z_+-/]{1,256}?/i);
            // this special-case "token" represents a place where a macro-token expanded into a white-space literal
            // in this case we accept any non-newline white-space
            case " ":
              return simple(/[^\S\n\r]/);
            default:
              return literal(t);
          }
        };

      const unit = unitate(token) || {
        invalidReason: MISSING_FTP,
      };

      unit.token = token;

      return unit;
    }

    const partTypeStyleToTokenVal = {
      year: {
        "2-digit": "yy",
        numeric: "yyyyy",
      },
      month: {
        numeric: "M",
        "2-digit": "MM",
        short: "MMM",
        long: "MMMM",
      },
      day: {
        numeric: "d",
        "2-digit": "dd",
      },
      weekday: {
        short: "EEE",
        long: "EEEE",
      },
      dayperiod: "a",
      dayPeriod: "a",
      hour12: {
        numeric: "h",
        "2-digit": "hh",
      },
      hour24: {
        numeric: "H",
        "2-digit": "HH",
      },
      minute: {
        numeric: "m",
        "2-digit": "mm",
      },
      second: {
        numeric: "s",
        "2-digit": "ss",
      },
      timeZoneName: {
        long: "ZZZZZ",
        short: "ZZZ",
      },
    };

    function tokenForPart(part, formatOpts, resolvedOpts) {
      const { type, value } = part;

      if (type === "literal") {
        const isSpace = /^\s+$/.test(value);
        return {
          literal: !isSpace,
          val: isSpace ? " " : value,
        };
      }

      const style = formatOpts[type];

      // The user might have explicitly specified hour12 or hourCycle
      // if so, respect their decision
      // if not, refer back to the resolvedOpts, which are based on the locale
      let actualType = type;
      if (type === "hour") {
        if (formatOpts.hour12 != null) {
          actualType = formatOpts.hour12 ? "hour12" : "hour24";
        } else if (formatOpts.hourCycle != null) {
          if (formatOpts.hourCycle === "h11" || formatOpts.hourCycle === "h12") {
            actualType = "hour12";
          } else {
            actualType = "hour24";
          }
        } else {
          // tokens only differentiate between 24 hours or not,
          // so we do not need to check hourCycle here, which is less supported anyways
          actualType = resolvedOpts.hour12 ? "hour12" : "hour24";
        }
      }
      let val = partTypeStyleToTokenVal[actualType];
      if (typeof val === "object") {
        val = val[style];
      }

      if (val) {
        return {
          literal: false,
          val,
        };
      }

      return undefined;
    }

    function buildRegex(units) {
      const re = units.map((u) => u.regex).reduce((f, r) => `${f}(${r.source})`, "");
      return [`^${re}$`, units];
    }

    function match(input, regex, handlers) {
      const matches = input.match(regex);

      if (matches) {
        const all = {};
        let matchIndex = 1;
        for (const i in handlers) {
          if (hasOwnProperty(handlers, i)) {
            const h = handlers[i],
              groups = h.groups ? h.groups + 1 : 1;
            if (!h.literal && h.token) {
              all[h.token.val[0]] = h.deser(matches.slice(matchIndex, matchIndex + groups));
            }
            matchIndex += groups;
          }
        }
        return [matches, all];
      } else {
        return [matches, {}];
      }
    }

    function dateTimeFromMatches(matches) {
      const toField = (token) => {
        switch (token) {
          case "S":
            return "millisecond";
          case "s":
            return "second";
          case "m":
            return "minute";
          case "h":
          case "H":
            return "hour";
          case "d":
            return "day";
          case "o":
            return "ordinal";
          case "L":
          case "M":
            return "month";
          case "y":
            return "year";
          case "E":
          case "c":
            return "weekday";
          case "W":
            return "weekNumber";
          case "k":
            return "weekYear";
          case "q":
            return "quarter";
          default:
            return null;
        }
      };

      let zone = null;
      let specificOffset;
      if (!isUndefined(matches.z)) {
        zone = IANAZone.create(matches.z);
      }

      if (!isUndefined(matches.Z)) {
        if (!zone) {
          zone = new FixedOffsetZone(matches.Z);
        }
        specificOffset = matches.Z;
      }

      if (!isUndefined(matches.q)) {
        matches.M = (matches.q - 1) * 3 + 1;
      }

      if (!isUndefined(matches.h)) {
        if (matches.h < 12 && matches.a === 1) {
          matches.h += 12;
        } else if (matches.h === 12 && matches.a === 0) {
          matches.h = 0;
        }
      }

      if (matches.G === 0 && matches.y) {
        matches.y = -matches.y;
      }

      if (!isUndefined(matches.u)) {
        matches.S = parseMillis(matches.u);
      }

      const vals = Object.keys(matches).reduce((r, k) => {
        const f = toField(k);
        if (f) {
          r[f] = matches[k];
        }

        return r;
      }, {});

      return [vals, zone, specificOffset];
    }

    let dummyDateTimeCache = null;

    function getDummyDateTime() {
      if (!dummyDateTimeCache) {
        dummyDateTimeCache = DateTime.fromMillis(1555555555555);
      }

      return dummyDateTimeCache;
    }

    function maybeExpandMacroToken(token, locale) {
      if (token.literal) {
        return token;
      }

      const formatOpts = Formatter.macroTokenToFormatOpts(token.val);
      const tokens = formatOptsToTokens(formatOpts, locale);

      if (tokens == null || tokens.includes(undefined)) {
        return token;
      }

      return tokens;
    }

    function expandMacroTokens(tokens, locale) {
      return Array.prototype.concat(...tokens.map((t) => maybeExpandMacroToken(t, locale)));
    }

    /**
     * @private
     */

    class TokenParser {
      constructor(locale, format) {
        this.locale = locale;
        this.format = format;
        this.tokens = expandMacroTokens(Formatter.parseFormat(format), locale);
        this.units = this.tokens.map((t) => unitForToken(t, locale));
        this.disqualifyingUnit = this.units.find((t) => t.invalidReason);

        if (!this.disqualifyingUnit) {
          const [regexString, handlers] = buildRegex(this.units);
          this.regex = RegExp(regexString, "i");
          this.handlers = handlers;
        }
      }

      explainFromTokens(input) {
        if (!this.isValid) {
          return { input, tokens: this.tokens, invalidReason: this.invalidReason };
        } else {
          const [rawMatches, matches] = match(input, this.regex, this.handlers),
            [result, zone, specificOffset] = matches
              ? dateTimeFromMatches(matches)
              : [null, null, undefined];
          if (hasOwnProperty(matches, "a") && hasOwnProperty(matches, "H")) {
            throw new ConflictingSpecificationError(
              "Can't include meridiem when specifying 24-hour format"
            );
          }
          return {
            input,
            tokens: this.tokens,
            regex: this.regex,
            rawMatches,
            matches,
            result,
            zone,
            specificOffset,
          };
        }
      }

      get isValid() {
        return !this.disqualifyingUnit;
      }

      get invalidReason() {
        return this.disqualifyingUnit ? this.disqualifyingUnit.invalidReason : null;
      }
    }

    function explainFromTokens(locale, input, format) {
      const parser = new TokenParser(locale, format);
      return parser.explainFromTokens(input);
    }

    function parseFromTokens(locale, input, format) {
      const { result, zone, specificOffset, invalidReason } = explainFromTokens(locale, input, format);
      return [result, zone, specificOffset, invalidReason];
    }

    function formatOptsToTokens(formatOpts, locale) {
      if (!formatOpts) {
        return null;
      }

      const formatter = Formatter.create(locale, formatOpts);
      const df = formatter.dtFormatter(getDummyDateTime());
      const parts = df.formatToParts();
      const resolvedOpts = df.resolvedOptions();
      return parts.map((p) => tokenForPart(p, formatOpts, resolvedOpts));
    }

    const INVALID = "Invalid DateTime";
    const MAX_DATE = 8.64e15;

    function unsupportedZone(zone) {
      return new Invalid("unsupported zone", `the zone "${zone.name}" is not supported`);
    }

    // we cache week data on the DT object and this intermediates the cache
    /**
     * @param {DateTime} dt
     */
    function possiblyCachedWeekData(dt) {
      if (dt.weekData === null) {
        dt.weekData = gregorianToWeek(dt.c);
      }
      return dt.weekData;
    }

    /**
     * @param {DateTime} dt
     */
    function possiblyCachedLocalWeekData(dt) {
      if (dt.localWeekData === null) {
        dt.localWeekData = gregorianToWeek(
          dt.c,
          dt.loc.getMinDaysInFirstWeek(),
          dt.loc.getStartOfWeek()
        );
      }
      return dt.localWeekData;
    }

    // clone really means, "make a new object with these modifications". all "setters" really use this
    // to create a new object while only changing some of the properties
    function clone(inst, alts) {
      const current = {
        ts: inst.ts,
        zone: inst.zone,
        c: inst.c,
        o: inst.o,
        loc: inst.loc,
        invalid: inst.invalid,
      };
      return new DateTime({ ...current, ...alts, old: current });
    }

    // find the right offset a given local time. The o input is our guess, which determines which
    // offset we'll pick in ambiguous cases (e.g. there are two 3 AMs b/c Fallback DST)
    function fixOffset(localTS, o, tz) {
      // Our UTC time is just a guess because our offset is just a guess
      let utcGuess = localTS - o * 60 * 1000;

      // Test whether the zone matches the offset for this ts
      const o2 = tz.offset(utcGuess);

      // If so, offset didn't change and we're done
      if (o === o2) {
        return [utcGuess, o];
      }

      // If not, change the ts by the difference in the offset
      utcGuess -= (o2 - o) * 60 * 1000;

      // If that gives us the local time we want, we're done
      const o3 = tz.offset(utcGuess);
      if (o2 === o3) {
        return [utcGuess, o2];
      }

      // If it's different, we're in a hole time. The offset has changed, but the we don't adjust the time
      return [localTS - Math.min(o2, o3) * 60 * 1000, Math.max(o2, o3)];
    }

    // convert an epoch timestamp into a calendar object with the given offset
    function tsToObj(ts, offset) {
      ts += offset * 60 * 1000;

      const d = new Date(ts);

      return {
        year: d.getUTCFullYear(),
        month: d.getUTCMonth() + 1,
        day: d.getUTCDate(),
        hour: d.getUTCHours(),
        minute: d.getUTCMinutes(),
        second: d.getUTCSeconds(),
        millisecond: d.getUTCMilliseconds(),
      };
    }

    // convert a calendar object to a epoch timestamp
    function objToTS(obj, offset, zone) {
      return fixOffset(objToLocalTS(obj), offset, zone);
    }

    // create a new DT instance by adding a duration, adjusting for DSTs
    function adjustTime(inst, dur) {
      const oPre = inst.o,
        year = inst.c.year + Math.trunc(dur.years),
        month = inst.c.month + Math.trunc(dur.months) + Math.trunc(dur.quarters) * 3,
        c = {
          ...inst.c,
          year,
          month,
          day:
            Math.min(inst.c.day, daysInMonth(year, month)) +
            Math.trunc(dur.days) +
            Math.trunc(dur.weeks) * 7,
        },
        millisToAdd = Duration.fromObject({
          years: dur.years - Math.trunc(dur.years),
          quarters: dur.quarters - Math.trunc(dur.quarters),
          months: dur.months - Math.trunc(dur.months),
          weeks: dur.weeks - Math.trunc(dur.weeks),
          days: dur.days - Math.trunc(dur.days),
          hours: dur.hours,
          minutes: dur.minutes,
          seconds: dur.seconds,
          milliseconds: dur.milliseconds,
        }).as("milliseconds"),
        localTS = objToLocalTS(c);

      let [ts, o] = fixOffset(localTS, oPre, inst.zone);

      if (millisToAdd !== 0) {
        ts += millisToAdd;
        // that could have changed the offset by going over a DST, but we want to keep the ts the same
        o = inst.zone.offset(ts);
      }

      return { ts, o };
    }

    // helper useful in turning the results of parsing into real dates
    // by handling the zone options
    function parseDataToDateTime(parsed, parsedZone, opts, format, text, specificOffset) {
      const { setZone, zone } = opts;
      if ((parsed && Object.keys(parsed).length !== 0) || parsedZone) {
        const interpretationZone = parsedZone || zone,
          inst = DateTime.fromObject(parsed, {
            ...opts,
            zone: interpretationZone,
            specificOffset,
          });
        return setZone ? inst : inst.setZone(zone);
      } else {
        return DateTime.invalid(
          new Invalid("unparsable", `the input "${text}" can't be parsed as ${format}`)
        );
      }
    }

    // if you want to output a technical format (e.g. RFC 2822), this helper
    // helps handle the details
    function toTechFormat(dt, format, allowZ = true) {
      return dt.isValid
        ? Formatter.create(Locale.create("en-US"), {
            allowZ,
            forceSimple: true,
          }).formatDateTimeFromString(dt, format)
        : null;
    }

    function toISODate(o, extended) {
      const longFormat = o.c.year > 9999 || o.c.year < 0;
      let c = "";
      if (longFormat && o.c.year >= 0) c += "+";
      c += padStart(o.c.year, longFormat ? 6 : 4);

      if (extended) {
        c += "-";
        c += padStart(o.c.month);
        c += "-";
        c += padStart(o.c.day);
      } else {
        c += padStart(o.c.month);
        c += padStart(o.c.day);
      }
      return c;
    }

    function toISOTime(
      o,
      extended,
      suppressSeconds,
      suppressMilliseconds,
      includeOffset,
      extendedZone
    ) {
      let c = padStart(o.c.hour);
      if (extended) {
        c += ":";
        c += padStart(o.c.minute);
        if (o.c.millisecond !== 0 || o.c.second !== 0 || !suppressSeconds) {
          c += ":";
        }
      } else {
        c += padStart(o.c.minute);
      }

      if (o.c.millisecond !== 0 || o.c.second !== 0 || !suppressSeconds) {
        c += padStart(o.c.second);

        if (o.c.millisecond !== 0 || !suppressMilliseconds) {
          c += ".";
          c += padStart(o.c.millisecond, 3);
        }
      }

      if (includeOffset) {
        if (o.isOffsetFixed && o.offset === 0 && !extendedZone) {
          c += "Z";
        } else if (o.o < 0) {
          c += "-";
          c += padStart(Math.trunc(-o.o / 60));
          c += ":";
          c += padStart(Math.trunc(-o.o % 60));
        } else {
          c += "+";
          c += padStart(Math.trunc(o.o / 60));
          c += ":";
          c += padStart(Math.trunc(o.o % 60));
        }
      }

      if (extendedZone) {
        c += "[" + o.zone.ianaName + "]";
      }
      return c;
    }

    // defaults for unspecified units in the supported calendars
    const defaultUnitValues = {
        month: 1,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      },
      defaultWeekUnitValues = {
        weekNumber: 1,
        weekday: 1,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      },
      defaultOrdinalUnitValues = {
        ordinal: 1,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      };

    // Units in the supported calendars, sorted by bigness
    const orderedUnits = ["year", "month", "day", "hour", "minute", "second", "millisecond"],
      orderedWeekUnits = [
        "weekYear",
        "weekNumber",
        "weekday",
        "hour",
        "minute",
        "second",
        "millisecond",
      ],
      orderedOrdinalUnits = ["year", "ordinal", "hour", "minute", "second", "millisecond"];

    // standardize case and plurality in units
    function normalizeUnit(unit) {
      const normalized = {
        year: "year",
        years: "year",
        month: "month",
        months: "month",
        day: "day",
        days: "day",
        hour: "hour",
        hours: "hour",
        minute: "minute",
        minutes: "minute",
        quarter: "quarter",
        quarters: "quarter",
        second: "second",
        seconds: "second",
        millisecond: "millisecond",
        milliseconds: "millisecond",
        weekday: "weekday",
        weekdays: "weekday",
        weeknumber: "weekNumber",
        weeksnumber: "weekNumber",
        weeknumbers: "weekNumber",
        weekyear: "weekYear",
        weekyears: "weekYear",
        ordinal: "ordinal",
      }[unit.toLowerCase()];

      if (!normalized) throw new InvalidUnitError(unit);

      return normalized;
    }

    function normalizeUnitWithLocalWeeks(unit) {
      switch (unit.toLowerCase()) {
        case "localweekday":
        case "localweekdays":
          return "localWeekday";
        case "localweeknumber":
        case "localweeknumbers":
          return "localWeekNumber";
        case "localweekyear":
        case "localweekyears":
          return "localWeekYear";
        default:
          return normalizeUnit(unit);
      }
    }

    // cache offsets for zones based on the current timestamp when this function is
    // first called. When we are handling a datetime from components like (year,
    // month, day, hour) in a time zone, we need a guess about what the timezone
    // offset is so that we can convert into a UTC timestamp. One way is to find the
    // offset of now in the zone. The actual date may have a different offset (for
    // example, if we handle a date in June while we're in December in a zone that
    // observes DST), but we can check and adjust that.
    //
    // When handling many dates, calculating the offset for now every time is
    // expensive. It's just a guess, so we can cache the offset to use even if we
    // are right on a time change boundary (we'll just correct in the other
    // direction). Using a timestamp from first read is a slight optimization for
    // handling dates close to the current date, since those dates will usually be
    // in the same offset (we could set the timestamp statically, instead). We use a
    // single timestamp for all zones to make things a bit more predictable.
    //
    // This is safe for quickDT (used by local() and utc()) because we don't fill in
    // higher-order units from tsNow (as we do in fromObject, this requires that
    // offset is calculated from tsNow).
    /**
     * @param {Zone} zone
     * @return {number}
     */
    function guessOffsetForZone(zone) {
      if (zoneOffsetTs === undefined) {
        zoneOffsetTs = Settings.now();
      }

      // Do not cache anything but IANA zones, because it is not safe to do so.
      // Guessing an offset which is not present in the zone can cause wrong results from fixOffset
      if (zone.type !== "iana") {
        return zone.offset(zoneOffsetTs);
      }
      const zoneName = zone.name;
      if (!zoneOffsetGuessCache[zoneName]) {
        zoneOffsetGuessCache[zoneName] = zone.offset(zoneOffsetTs);
      }
      return zoneOffsetGuessCache[zoneName];
    }

    // this is a dumbed down version of fromObject() that runs about 60% faster
    // but doesn't do any validation, makes a bunch of assumptions about what units
    // are present, and so on.
    function quickDT(obj, opts) {
      const zone = normalizeZone(opts.zone, Settings.defaultZone);
      if (!zone.isValid) {
        return DateTime.invalid(unsupportedZone(zone));
      }

      const loc = Locale.fromObject(opts);

      let ts, o;

      // assume we have the higher-order units
      if (!isUndefined(obj.year)) {
        for (const u of orderedUnits) {
          if (isUndefined(obj[u])) {
            obj[u] = defaultUnitValues[u];
          }
        }

        const invalid = hasInvalidGregorianData(obj) || hasInvalidTimeData(obj);
        if (invalid) {
          return DateTime.invalid(invalid);
        }

        const offsetProvis = guessOffsetForZone(zone);
        [ts, o] = objToTS(obj, offsetProvis, zone);
      } else {
        ts = Settings.now();
      }

      return new DateTime({ ts, zone, loc, o });
    }

    function diffRelative(start, end, opts) {
      const round = isUndefined(opts.round) ? true : opts.round,
        format = (c, unit) => {
          c = roundTo(c, round || opts.calendary ? 0 : 2, true);
          const formatter = end.loc.clone(opts).relFormatter(opts);
          return formatter.format(c, unit);
        },
        differ = (unit) => {
          if (opts.calendary) {
            if (!end.hasSame(start, unit)) {
              return end.startOf(unit).diff(start.startOf(unit), unit).get(unit);
            } else return 0;
          } else {
            return end.diff(start, unit).get(unit);
          }
        };

      if (opts.unit) {
        return format(differ(opts.unit), opts.unit);
      }

      for (const unit of opts.units) {
        const count = differ(unit);
        if (Math.abs(count) >= 1) {
          return format(count, unit);
        }
      }
      return format(start > end ? -0 : 0, opts.units[opts.units.length - 1]);
    }

    function lastOpts(argList) {
      let opts = {},
        args;
      if (argList.length > 0 && typeof argList[argList.length - 1] === "object") {
        opts = argList[argList.length - 1];
        args = Array.from(argList).slice(0, argList.length - 1);
      } else {
        args = Array.from(argList);
      }
      return [opts, args];
    }

    /**
     * Timestamp to use for cached zone offset guesses (exposed for test)
     */
    let zoneOffsetTs;
    /**
     * Cache for zone offset guesses (exposed for test).
     *
     * This optimizes quickDT via guessOffsetForZone to avoid repeated calls of
     * zone.offset().
     */
    let zoneOffsetGuessCache = {};

    /**
     * A DateTime is an immutable data structure representing a specific date and time and accompanying methods. It contains class and instance methods for creating, parsing, interrogating, transforming, and formatting them.
     *
     * A DateTime comprises of:
     * * A timestamp. Each DateTime instance refers to a specific millisecond of the Unix epoch.
     * * A time zone. Each instance is considered in the context of a specific zone (by default the local system's zone).
     * * Configuration properties that effect how output strings are formatted, such as `locale`, `numberingSystem`, and `outputCalendar`.
     *
     * Here is a brief overview of the most commonly used functionality it provides:
     *
     * * **Creation**: To create a DateTime from its components, use one of its factory class methods: {@link DateTime.local}, {@link DateTime.utc}, and (most flexibly) {@link DateTime.fromObject}. To create one from a standard string format, use {@link DateTime.fromISO}, {@link DateTime.fromHTTP}, and {@link DateTime.fromRFC2822}. To create one from a custom string format, use {@link DateTime.fromFormat}. To create one from a native JS date, use {@link DateTime.fromJSDate}.
     * * **Gregorian calendar and time**: To examine the Gregorian properties of a DateTime individually (i.e as opposed to collectively through {@link DateTime#toObject}), use the {@link DateTime#year}, {@link DateTime#month},
     * {@link DateTime#day}, {@link DateTime#hour}, {@link DateTime#minute}, {@link DateTime#second}, {@link DateTime#millisecond} accessors.
     * * **Week calendar**: For ISO week calendar attributes, see the {@link DateTime#weekYear}, {@link DateTime#weekNumber}, and {@link DateTime#weekday} accessors.
     * * **Configuration** See the {@link DateTime#locale} and {@link DateTime#numberingSystem} accessors.
     * * **Transformation**: To transform the DateTime into other DateTimes, use {@link DateTime#set}, {@link DateTime#reconfigure}, {@link DateTime#setZone}, {@link DateTime#setLocale}, {@link DateTime.plus}, {@link DateTime#minus}, {@link DateTime#endOf}, {@link DateTime#startOf}, {@link DateTime#toUTC}, and {@link DateTime#toLocal}.
     * * **Output**: To convert the DateTime to other representations, use the {@link DateTime#toRelative}, {@link DateTime#toRelativeCalendar}, {@link DateTime#toJSON}, {@link DateTime#toISO}, {@link DateTime#toHTTP}, {@link DateTime#toObject}, {@link DateTime#toRFC2822}, {@link DateTime#toString}, {@link DateTime#toLocaleString}, {@link DateTime#toFormat}, {@link DateTime#toMillis} and {@link DateTime#toJSDate}.
     *
     * There's plenty others documented below. In addition, for more information on subtler topics like internationalization, time zones, alternative calendars, validity, and so on, see the external documentation.
     */
    class DateTime {
      /**
       * @access private
       */
      constructor(config) {
        const zone = config.zone || Settings.defaultZone;

        let invalid =
          config.invalid ||
          (Number.isNaN(config.ts) ? new Invalid("invalid input") : null) ||
          (!zone.isValid ? unsupportedZone(zone) : null);
        /**
         * @access private
         */
        this.ts = isUndefined(config.ts) ? Settings.now() : config.ts;

        let c = null,
          o = null;
        if (!invalid) {
          const unchanged = config.old && config.old.ts === this.ts && config.old.zone.equals(zone);

          if (unchanged) {
            [c, o] = [config.old.c, config.old.o];
          } else {
            // If an offset has been passed and we have not been called from
            // clone(), we can trust it and avoid the offset calculation.
            const ot = isNumber(config.o) && !config.old ? config.o : zone.offset(this.ts);
            c = tsToObj(this.ts, ot);
            invalid = Number.isNaN(c.year) ? new Invalid("invalid input") : null;
            c = invalid ? null : c;
            o = invalid ? null : ot;
          }
        }

        /**
         * @access private
         */
        this._zone = zone;
        /**
         * @access private
         */
        this.loc = config.loc || Locale.create();
        /**
         * @access private
         */
        this.invalid = invalid;
        /**
         * @access private
         */
        this.weekData = null;
        /**
         * @access private
         */
        this.localWeekData = null;
        /**
         * @access private
         */
        this.c = c;
        /**
         * @access private
         */
        this.o = o;
        /**
         * @access private
         */
        this.isLuxonDateTime = true;
      }

      // CONSTRUCT

      /**
       * Create a DateTime for the current instant, in the system's time zone.
       *
       * Use Settings to override these default values if needed.
       * @example DateTime.now().toISO() //~> now in the ISO format
       * @return {DateTime}
       */
      static now() {
        return new DateTime({});
      }

      /**
       * Create a local DateTime
       * @param {number} [year] - The calendar year. If omitted (as in, call `local()` with no arguments), the current time will be used
       * @param {number} [month=1] - The month, 1-indexed
       * @param {number} [day=1] - The day of the month, 1-indexed
       * @param {number} [hour=0] - The hour of the day, in 24-hour time
       * @param {number} [minute=0] - The minute of the hour, meaning a number between 0 and 59
       * @param {number} [second=0] - The second of the minute, meaning a number between 0 and 59
       * @param {number} [millisecond=0] - The millisecond of the second, meaning a number between 0 and 999
       * @example DateTime.local()                                  //~> now
       * @example DateTime.local({ zone: "America/New_York" })      //~> now, in US east coast time
       * @example DateTime.local(2017)                              //~> 2017-01-01T00:00:00
       * @example DateTime.local(2017, 3)                           //~> 2017-03-01T00:00:00
       * @example DateTime.local(2017, 3, 12, { locale: "fr" })     //~> 2017-03-12T00:00:00, with a French locale
       * @example DateTime.local(2017, 3, 12, 5)                    //~> 2017-03-12T05:00:00
       * @example DateTime.local(2017, 3, 12, 5, { zone: "utc" })   //~> 2017-03-12T05:00:00, in UTC
       * @example DateTime.local(2017, 3, 12, 5, 45)                //~> 2017-03-12T05:45:00
       * @example DateTime.local(2017, 3, 12, 5, 45, 10)            //~> 2017-03-12T05:45:10
       * @example DateTime.local(2017, 3, 12, 5, 45, 10, 765)       //~> 2017-03-12T05:45:10.765
       * @return {DateTime}
       */
      static local() {
        const [opts, args] = lastOpts(arguments),
          [year, month, day, hour, minute, second, millisecond] = args;
        return quickDT({ year, month, day, hour, minute, second, millisecond }, opts);
      }

      /**
       * Create a DateTime in UTC
       * @param {number} [year] - The calendar year. If omitted (as in, call `utc()` with no arguments), the current time will be used
       * @param {number} [month=1] - The month, 1-indexed
       * @param {number} [day=1] - The day of the month
       * @param {number} [hour=0] - The hour of the day, in 24-hour time
       * @param {number} [minute=0] - The minute of the hour, meaning a number between 0 and 59
       * @param {number} [second=0] - The second of the minute, meaning a number between 0 and 59
       * @param {number} [millisecond=0] - The millisecond of the second, meaning a number between 0 and 999
       * @param {Object} options - configuration options for the DateTime
       * @param {string} [options.locale] - a locale to set on the resulting DateTime instance
       * @param {string} [options.outputCalendar] - the output calendar to set on the resulting DateTime instance
       * @param {string} [options.numberingSystem] - the numbering system to set on the resulting DateTime instance
       * @param {string} [options.weekSettings] - the week settings to set on the resulting DateTime instance
       * @example DateTime.utc()                                              //~> now
       * @example DateTime.utc(2017)                                          //~> 2017-01-01T00:00:00Z
       * @example DateTime.utc(2017, 3)                                       //~> 2017-03-01T00:00:00Z
       * @example DateTime.utc(2017, 3, 12)                                   //~> 2017-03-12T00:00:00Z
       * @example DateTime.utc(2017, 3, 12, 5)                                //~> 2017-03-12T05:00:00Z
       * @example DateTime.utc(2017, 3, 12, 5, 45)                            //~> 2017-03-12T05:45:00Z
       * @example DateTime.utc(2017, 3, 12, 5, 45, { locale: "fr" })          //~> 2017-03-12T05:45:00Z with a French locale
       * @example DateTime.utc(2017, 3, 12, 5, 45, 10)                        //~> 2017-03-12T05:45:10Z
       * @example DateTime.utc(2017, 3, 12, 5, 45, 10, 765, { locale: "fr" }) //~> 2017-03-12T05:45:10.765Z with a French locale
       * @return {DateTime}
       */
      static utc() {
        const [opts, args] = lastOpts(arguments),
          [year, month, day, hour, minute, second, millisecond] = args;

        opts.zone = FixedOffsetZone.utcInstance;
        return quickDT({ year, month, day, hour, minute, second, millisecond }, opts);
      }

      /**
       * Create a DateTime from a JavaScript Date object. Uses the default zone.
       * @param {Date} date - a JavaScript Date object
       * @param {Object} options - configuration options for the DateTime
       * @param {string|Zone} [options.zone='local'] - the zone to place the DateTime into
       * @return {DateTime}
       */
      static fromJSDate(date, options = {}) {
        const ts = isDate(date) ? date.valueOf() : NaN;
        if (Number.isNaN(ts)) {
          return DateTime.invalid("invalid input");
        }

        const zoneToUse = normalizeZone(options.zone, Settings.defaultZone);
        if (!zoneToUse.isValid) {
          return DateTime.invalid(unsupportedZone(zoneToUse));
        }

        return new DateTime({
          ts: ts,
          zone: zoneToUse,
          loc: Locale.fromObject(options),
        });
      }

      /**
       * Create a DateTime from a number of milliseconds since the epoch (meaning since 1 January 1970 00:00:00 UTC). Uses the default zone.
       * @param {number} milliseconds - a number of milliseconds since 1970 UTC
       * @param {Object} options - configuration options for the DateTime
       * @param {string|Zone} [options.zone='local'] - the zone to place the DateTime into
       * @param {string} [options.locale] - a locale to set on the resulting DateTime instance
       * @param {string} options.outputCalendar - the output calendar to set on the resulting DateTime instance
       * @param {string} options.numberingSystem - the numbering system to set on the resulting DateTime instance
       * @param {string} options.weekSettings - the week settings to set on the resulting DateTime instance
       * @return {DateTime}
       */
      static fromMillis(milliseconds, options = {}) {
        if (!isNumber(milliseconds)) {
          throw new InvalidArgumentError(
            `fromMillis requires a numerical input, but received a ${typeof milliseconds} with value ${milliseconds}`
          );
        } else if (milliseconds < -864e13 || milliseconds > MAX_DATE) {
          // this isn't perfect because we can still end up out of range because of additional shifting, but it's a start
          return DateTime.invalid("Timestamp out of range");
        } else {
          return new DateTime({
            ts: milliseconds,
            zone: normalizeZone(options.zone, Settings.defaultZone),
            loc: Locale.fromObject(options),
          });
        }
      }

      /**
       * Create a DateTime from a number of seconds since the epoch (meaning since 1 January 1970 00:00:00 UTC). Uses the default zone.
       * @param {number} seconds - a number of seconds since 1970 UTC
       * @param {Object} options - configuration options for the DateTime
       * @param {string|Zone} [options.zone='local'] - the zone to place the DateTime into
       * @param {string} [options.locale] - a locale to set on the resulting DateTime instance
       * @param {string} options.outputCalendar - the output calendar to set on the resulting DateTime instance
       * @param {string} options.numberingSystem - the numbering system to set on the resulting DateTime instance
       * @param {string} options.weekSettings - the week settings to set on the resulting DateTime instance
       * @return {DateTime}
       */
      static fromSeconds(seconds, options = {}) {
        if (!isNumber(seconds)) {
          throw new InvalidArgumentError("fromSeconds requires a numerical input");
        } else {
          return new DateTime({
            ts: seconds * 1000,
            zone: normalizeZone(options.zone, Settings.defaultZone),
            loc: Locale.fromObject(options),
          });
        }
      }

      /**
       * Create a DateTime from a JavaScript object with keys like 'year' and 'hour' with reasonable defaults.
       * @param {Object} obj - the object to create the DateTime from
       * @param {number} obj.year - a year, such as 1987
       * @param {number} obj.month - a month, 1-12
       * @param {number} obj.day - a day of the month, 1-31, depending on the month
       * @param {number} obj.ordinal - day of the year, 1-365 or 366
       * @param {number} obj.weekYear - an ISO week year
       * @param {number} obj.weekNumber - an ISO week number, between 1 and 52 or 53, depending on the year
       * @param {number} obj.weekday - an ISO weekday, 1-7, where 1 is Monday and 7 is Sunday
       * @param {number} obj.localWeekYear - a week year, according to the locale
       * @param {number} obj.localWeekNumber - a week number, between 1 and 52 or 53, depending on the year, according to the locale
       * @param {number} obj.localWeekday - a weekday, 1-7, where 1 is the first and 7 is the last day of the week, according to the locale
       * @param {number} obj.hour - hour of the day, 0-23
       * @param {number} obj.minute - minute of the hour, 0-59
       * @param {number} obj.second - second of the minute, 0-59
       * @param {number} obj.millisecond - millisecond of the second, 0-999
       * @param {Object} opts - options for creating this DateTime
       * @param {string|Zone} [opts.zone='local'] - interpret the numbers in the context of a particular zone. Can take any value taken as the first argument to setZone()
       * @param {string} [opts.locale='system\'s locale'] - a locale to set on the resulting DateTime instance
       * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
       * @param {string} opts.numberingSystem - the numbering system to set on the resulting DateTime instance
       * @param {string} opts.weekSettings - the week settings to set on the resulting DateTime instance
       * @example DateTime.fromObject({ year: 1982, month: 5, day: 25}).toISODate() //=> '1982-05-25'
       * @example DateTime.fromObject({ year: 1982 }).toISODate() //=> '1982-01-01'
       * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6 }) //~> today at 10:26:06
       * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6 }, { zone: 'utc' }),
       * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6 }, { zone: 'local' })
       * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6 }, { zone: 'America/New_York' })
       * @example DateTime.fromObject({ weekYear: 2016, weekNumber: 2, weekday: 3 }).toISODate() //=> '2016-01-13'
       * @example DateTime.fromObject({ localWeekYear: 2022, localWeekNumber: 1, localWeekday: 1 }, { locale: "en-US" }).toISODate() //=> '2021-12-26'
       * @return {DateTime}
       */
      static fromObject(obj, opts = {}) {
        obj = obj || {};
        const zoneToUse = normalizeZone(opts.zone, Settings.defaultZone);
        if (!zoneToUse.isValid) {
          return DateTime.invalid(unsupportedZone(zoneToUse));
        }

        const loc = Locale.fromObject(opts);
        const normalized = normalizeObject(obj, normalizeUnitWithLocalWeeks);
        const { minDaysInFirstWeek, startOfWeek } = usesLocalWeekValues(normalized, loc);

        const tsNow = Settings.now(),
          offsetProvis = !isUndefined(opts.specificOffset)
            ? opts.specificOffset
            : zoneToUse.offset(tsNow),
          containsOrdinal = !isUndefined(normalized.ordinal),
          containsGregorYear = !isUndefined(normalized.year),
          containsGregorMD = !isUndefined(normalized.month) || !isUndefined(normalized.day),
          containsGregor = containsGregorYear || containsGregorMD,
          definiteWeekDef = normalized.weekYear || normalized.weekNumber;

        // cases:
        // just a weekday -> this week's instance of that weekday, no worries
        // (gregorian data or ordinal) + (weekYear or weekNumber) -> error
        // (gregorian month or day) + ordinal -> error
        // otherwise just use weeks or ordinals or gregorian, depending on what's specified

        if ((containsGregor || containsOrdinal) && definiteWeekDef) {
          throw new ConflictingSpecificationError(
            "Can't mix weekYear/weekNumber units with year/month/day or ordinals"
          );
        }

        if (containsGregorMD && containsOrdinal) {
          throw new ConflictingSpecificationError("Can't mix ordinal dates with month/day");
        }

        const useWeekData = definiteWeekDef || (normalized.weekday && !containsGregor);

        // configure ourselves to deal with gregorian dates or week stuff
        let units,
          defaultValues,
          objNow = tsToObj(tsNow, offsetProvis);
        if (useWeekData) {
          units = orderedWeekUnits;
          defaultValues = defaultWeekUnitValues;
          objNow = gregorianToWeek(objNow, minDaysInFirstWeek, startOfWeek);
        } else if (containsOrdinal) {
          units = orderedOrdinalUnits;
          defaultValues = defaultOrdinalUnitValues;
          objNow = gregorianToOrdinal(objNow);
        } else {
          units = orderedUnits;
          defaultValues = defaultUnitValues;
        }

        // set default values for missing stuff
        let foundFirst = false;
        for (const u of units) {
          const v = normalized[u];
          if (!isUndefined(v)) {
            foundFirst = true;
          } else if (foundFirst) {
            normalized[u] = defaultValues[u];
          } else {
            normalized[u] = objNow[u];
          }
        }

        // make sure the values we have are in range
        const higherOrderInvalid = useWeekData
            ? hasInvalidWeekData(normalized, minDaysInFirstWeek, startOfWeek)
            : containsOrdinal
            ? hasInvalidOrdinalData(normalized)
            : hasInvalidGregorianData(normalized),
          invalid = higherOrderInvalid || hasInvalidTimeData(normalized);

        if (invalid) {
          return DateTime.invalid(invalid);
        }

        // compute the actual time
        const gregorian = useWeekData
            ? weekToGregorian(normalized, minDaysInFirstWeek, startOfWeek)
            : containsOrdinal
            ? ordinalToGregorian(normalized)
            : normalized,
          [tsFinal, offsetFinal] = objToTS(gregorian, offsetProvis, zoneToUse),
          inst = new DateTime({
            ts: tsFinal,
            zone: zoneToUse,
            o: offsetFinal,
            loc,
          });

        // gregorian data + weekday serves only to validate
        if (normalized.weekday && containsGregor && obj.weekday !== inst.weekday) {
          return DateTime.invalid(
            "mismatched weekday",
            `you can't specify both a weekday of ${normalized.weekday} and a date of ${inst.toISO()}`
          );
        }

        if (!inst.isValid) {
          return DateTime.invalid(inst.invalid);
        }

        return inst;
      }

      /**
       * Create a DateTime from an ISO 8601 string
       * @param {string} text - the ISO string
       * @param {Object} opts - options to affect the creation
       * @param {string|Zone} [opts.zone='local'] - use this zone if no offset is specified in the input string itself. Will also convert the time to this zone
       * @param {boolean} [opts.setZone=false] - override the zone with a fixed-offset zone specified in the string itself, if it specifies one
       * @param {string} [opts.locale='system's locale'] - a locale to set on the resulting DateTime instance
       * @param {string} [opts.outputCalendar] - the output calendar to set on the resulting DateTime instance
       * @param {string} [opts.numberingSystem] - the numbering system to set on the resulting DateTime instance
       * @param {string} [opts.weekSettings] - the week settings to set on the resulting DateTime instance
       * @example DateTime.fromISO('2016-05-25T09:08:34.123')
       * @example DateTime.fromISO('2016-05-25T09:08:34.123+06:00')
       * @example DateTime.fromISO('2016-05-25T09:08:34.123+06:00', {setZone: true})
       * @example DateTime.fromISO('2016-05-25T09:08:34.123', {zone: 'utc'})
       * @example DateTime.fromISO('2016-W05-4')
       * @return {DateTime}
       */
      static fromISO(text, opts = {}) {
        const [vals, parsedZone] = parseISODate(text);
        return parseDataToDateTime(vals, parsedZone, opts, "ISO 8601", text);
      }

      /**
       * Create a DateTime from an RFC 2822 string
       * @param {string} text - the RFC 2822 string
       * @param {Object} opts - options to affect the creation
       * @param {string|Zone} [opts.zone='local'] - convert the time to this zone. Since the offset is always specified in the string itself, this has no effect on the interpretation of string, merely the zone the resulting DateTime is expressed in.
       * @param {boolean} [opts.setZone=false] - override the zone with a fixed-offset zone specified in the string itself, if it specifies one
       * @param {string} [opts.locale='system's locale'] - a locale to set on the resulting DateTime instance
       * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
       * @param {string} opts.numberingSystem - the numbering system to set on the resulting DateTime instance
       * @param {string} opts.weekSettings - the week settings to set on the resulting DateTime instance
       * @example DateTime.fromRFC2822('25 Nov 2016 13:23:12 GMT')
       * @example DateTime.fromRFC2822('Fri, 25 Nov 2016 13:23:12 +0600')
       * @example DateTime.fromRFC2822('25 Nov 2016 13:23 Z')
       * @return {DateTime}
       */
      static fromRFC2822(text, opts = {}) {
        const [vals, parsedZone] = parseRFC2822Date(text);
        return parseDataToDateTime(vals, parsedZone, opts, "RFC 2822", text);
      }

      /**
       * Create a DateTime from an HTTP header date
       * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.3.1
       * @param {string} text - the HTTP header date
       * @param {Object} opts - options to affect the creation
       * @param {string|Zone} [opts.zone='local'] - convert the time to this zone. Since HTTP dates are always in UTC, this has no effect on the interpretation of string, merely the zone the resulting DateTime is expressed in.
       * @param {boolean} [opts.setZone=false] - override the zone with the fixed-offset zone specified in the string. For HTTP dates, this is always UTC, so this option is equivalent to setting the `zone` option to 'utc', but this option is included for consistency with similar methods.
       * @param {string} [opts.locale='system's locale'] - a locale to set on the resulting DateTime instance
       * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
       * @param {string} opts.numberingSystem - the numbering system to set on the resulting DateTime instance
       * @param {string} opts.weekSettings - the week settings to set on the resulting DateTime instance
       * @example DateTime.fromHTTP('Sun, 06 Nov 1994 08:49:37 GMT')
       * @example DateTime.fromHTTP('Sunday, 06-Nov-94 08:49:37 GMT')
       * @example DateTime.fromHTTP('Sun Nov  6 08:49:37 1994')
       * @return {DateTime}
       */
      static fromHTTP(text, opts = {}) {
        const [vals, parsedZone] = parseHTTPDate(text);
        return parseDataToDateTime(vals, parsedZone, opts, "HTTP", opts);
      }

      /**
       * Create a DateTime from an input string and format string.
       * Defaults to en-US if no locale has been specified, regardless of the system's locale. For a table of tokens and their interpretations, see [here](https://moment.github.io/luxon/#/parsing?id=table-of-tokens).
       * @param {string} text - the string to parse
       * @param {string} fmt - the format the string is expected to be in (see the link below for the formats)
       * @param {Object} opts - options to affect the creation
       * @param {string|Zone} [opts.zone='local'] - use this zone if no offset is specified in the input string itself. Will also convert the DateTime to this zone
       * @param {boolean} [opts.setZone=false] - override the zone with a zone specified in the string itself, if it specifies one
       * @param {string} [opts.locale='en-US'] - a locale string to use when parsing. Will also set the DateTime to this locale
       * @param {string} opts.numberingSystem - the numbering system to use when parsing. Will also set the resulting DateTime to this numbering system
       * @param {string} opts.weekSettings - the week settings to set on the resulting DateTime instance
       * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
       * @return {DateTime}
       */
      static fromFormat(text, fmt, opts = {}) {
        if (isUndefined(text) || isUndefined(fmt)) {
          throw new InvalidArgumentError("fromFormat requires an input string and a format");
        }

        const { locale = null, numberingSystem = null } = opts,
          localeToUse = Locale.fromOpts({
            locale,
            numberingSystem,
            defaultToEN: true,
          }),
          [vals, parsedZone, specificOffset, invalid] = parseFromTokens(localeToUse, text, fmt);
        if (invalid) {
          return DateTime.invalid(invalid);
        } else {
          return parseDataToDateTime(vals, parsedZone, opts, `format ${fmt}`, text, specificOffset);
        }
      }

      /**
       * @deprecated use fromFormat instead
       */
      static fromString(text, fmt, opts = {}) {
        return DateTime.fromFormat(text, fmt, opts);
      }

      /**
       * Create a DateTime from a SQL date, time, or datetime
       * Defaults to en-US if no locale has been specified, regardless of the system's locale
       * @param {string} text - the string to parse
       * @param {Object} opts - options to affect the creation
       * @param {string|Zone} [opts.zone='local'] - use this zone if no offset is specified in the input string itself. Will also convert the DateTime to this zone
       * @param {boolean} [opts.setZone=false] - override the zone with a zone specified in the string itself, if it specifies one
       * @param {string} [opts.locale='en-US'] - a locale string to use when parsing. Will also set the DateTime to this locale
       * @param {string} opts.numberingSystem - the numbering system to use when parsing. Will also set the resulting DateTime to this numbering system
       * @param {string} opts.weekSettings - the week settings to set on the resulting DateTime instance
       * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
       * @example DateTime.fromSQL('2017-05-15')
       * @example DateTime.fromSQL('2017-05-15 09:12:34')
       * @example DateTime.fromSQL('2017-05-15 09:12:34.342')
       * @example DateTime.fromSQL('2017-05-15 09:12:34.342+06:00')
       * @example DateTime.fromSQL('2017-05-15 09:12:34.342 America/Los_Angeles')
       * @example DateTime.fromSQL('2017-05-15 09:12:34.342 America/Los_Angeles', { setZone: true })
       * @example DateTime.fromSQL('2017-05-15 09:12:34.342', { zone: 'America/Los_Angeles' })
       * @example DateTime.fromSQL('09:12:34.342')
       * @return {DateTime}
       */
      static fromSQL(text, opts = {}) {
        const [vals, parsedZone] = parseSQL(text);
        return parseDataToDateTime(vals, parsedZone, opts, "SQL", text);
      }

      /**
       * Create an invalid DateTime.
       * @param {string} reason - simple string of why this DateTime is invalid. Should not contain parameters or anything else data-dependent.
       * @param {string} [explanation=null] - longer explanation, may include parameters and other useful debugging information
       * @return {DateTime}
       */
      static invalid(reason, explanation = null) {
        if (!reason) {
          throw new InvalidArgumentError("need to specify a reason the DateTime is invalid");
        }

        const invalid = reason instanceof Invalid ? reason : new Invalid(reason, explanation);

        if (Settings.throwOnInvalid) {
          throw new InvalidDateTimeError(invalid);
        } else {
          return new DateTime({ invalid });
        }
      }

      /**
       * Check if an object is an instance of DateTime. Works across context boundaries
       * @param {object} o
       * @return {boolean}
       */
      static isDateTime(o) {
        return (o && o.isLuxonDateTime) || false;
      }

      /**
       * Produce the format string for a set of options
       * @param formatOpts
       * @param localeOpts
       * @returns {string}
       */
      static parseFormatForOpts(formatOpts, localeOpts = {}) {
        const tokenList = formatOptsToTokens(formatOpts, Locale.fromObject(localeOpts));
        return !tokenList ? null : tokenList.map((t) => (t ? t.val : null)).join("");
      }

      /**
       * Produce the the fully expanded format token for the locale
       * Does NOT quote characters, so quoted tokens will not round trip correctly
       * @param fmt
       * @param localeOpts
       * @returns {string}
       */
      static expandFormat(fmt, localeOpts = {}) {
        const expanded = expandMacroTokens(Formatter.parseFormat(fmt), Locale.fromObject(localeOpts));
        return expanded.map((t) => t.val).join("");
      }

      static resetCache() {
        zoneOffsetTs = undefined;
        zoneOffsetGuessCache = {};
      }

      // INFO

      /**
       * Get the value of unit.
       * @param {string} unit - a unit such as 'minute' or 'day'
       * @example DateTime.local(2017, 7, 4).get('month'); //=> 7
       * @example DateTime.local(2017, 7, 4).get('day'); //=> 4
       * @return {number}
       */
      get(unit) {
        return this[unit];
      }

      /**
       * Returns whether the DateTime is valid. Invalid DateTimes occur when:
       * * The DateTime was created from invalid calendar information, such as the 13th month or February 30
       * * The DateTime was created by an operation on another invalid date
       * @type {boolean}
       */
      get isValid() {
        return this.invalid === null;
      }

      /**
       * Returns an error code if this DateTime is invalid, or null if the DateTime is valid
       * @type {string}
       */
      get invalidReason() {
        return this.invalid ? this.invalid.reason : null;
      }

      /**
       * Returns an explanation of why this DateTime became invalid, or null if the DateTime is valid
       * @type {string}
       */
      get invalidExplanation() {
        return this.invalid ? this.invalid.explanation : null;
      }

      /**
       * Get the locale of a DateTime, such 'en-GB'. The locale is used when formatting the DateTime
       *
       * @type {string}
       */
      get locale() {
        return this.isValid ? this.loc.locale : null;
      }

      /**
       * Get the numbering system of a DateTime, such 'beng'. The numbering system is used when formatting the DateTime
       *
       * @type {string}
       */
      get numberingSystem() {
        return this.isValid ? this.loc.numberingSystem : null;
      }

      /**
       * Get the output calendar of a DateTime, such 'islamic'. The output calendar is used when formatting the DateTime
       *
       * @type {string}
       */
      get outputCalendar() {
        return this.isValid ? this.loc.outputCalendar : null;
      }

      /**
       * Get the time zone associated with this DateTime.
       * @type {Zone}
       */
      get zone() {
        return this._zone;
      }

      /**
       * Get the name of the time zone.
       * @type {string}
       */
      get zoneName() {
        return this.isValid ? this.zone.name : null;
      }

      /**
       * Get the year
       * @example DateTime.local(2017, 5, 25).year //=> 2017
       * @type {number}
       */
      get year() {
        return this.isValid ? this.c.year : NaN;
      }

      /**
       * Get the quarter
       * @example DateTime.local(2017, 5, 25).quarter //=> 2
       * @type {number}
       */
      get quarter() {
        return this.isValid ? Math.ceil(this.c.month / 3) : NaN;
      }

      /**
       * Get the month (1-12).
       * @example DateTime.local(2017, 5, 25).month //=> 5
       * @type {number}
       */
      get month() {
        return this.isValid ? this.c.month : NaN;
      }

      /**
       * Get the day of the month (1-30ish).
       * @example DateTime.local(2017, 5, 25).day //=> 25
       * @type {number}
       */
      get day() {
        return this.isValid ? this.c.day : NaN;
      }

      /**
       * Get the hour of the day (0-23).
       * @example DateTime.local(2017, 5, 25, 9).hour //=> 9
       * @type {number}
       */
      get hour() {
        return this.isValid ? this.c.hour : NaN;
      }

      /**
       * Get the minute of the hour (0-59).
       * @example DateTime.local(2017, 5, 25, 9, 30).minute //=> 30
       * @type {number}
       */
      get minute() {
        return this.isValid ? this.c.minute : NaN;
      }

      /**
       * Get the second of the minute (0-59).
       * @example DateTime.local(2017, 5, 25, 9, 30, 52).second //=> 52
       * @type {number}
       */
      get second() {
        return this.isValid ? this.c.second : NaN;
      }

      /**
       * Get the millisecond of the second (0-999).
       * @example DateTime.local(2017, 5, 25, 9, 30, 52, 654).millisecond //=> 654
       * @type {number}
       */
      get millisecond() {
        return this.isValid ? this.c.millisecond : NaN;
      }

      /**
       * Get the week year
       * @see https://en.wikipedia.org/wiki/ISO_week_date
       * @example DateTime.local(2014, 12, 31).weekYear //=> 2015
       * @type {number}
       */
      get weekYear() {
        return this.isValid ? possiblyCachedWeekData(this).weekYear : NaN;
      }

      /**
       * Get the week number of the week year (1-52ish).
       * @see https://en.wikipedia.org/wiki/ISO_week_date
       * @example DateTime.local(2017, 5, 25).weekNumber //=> 21
       * @type {number}
       */
      get weekNumber() {
        return this.isValid ? possiblyCachedWeekData(this).weekNumber : NaN;
      }

      /**
       * Get the day of the week.
       * 1 is Monday and 7 is Sunday
       * @see https://en.wikipedia.org/wiki/ISO_week_date
       * @example DateTime.local(2014, 11, 31).weekday //=> 4
       * @type {number}
       */
      get weekday() {
        return this.isValid ? possiblyCachedWeekData(this).weekday : NaN;
      }

      /**
       * Returns true if this date is on a weekend according to the locale, false otherwise
       * @returns {boolean}
       */
      get isWeekend() {
        return this.isValid && this.loc.getWeekendDays().includes(this.weekday);
      }

      /**
       * Get the day of the week according to the locale.
       * 1 is the first day of the week and 7 is the last day of the week.
       * If the locale assigns Sunday as the first day of the week, then a date which is a Sunday will return 1,
       * @returns {number}
       */
      get localWeekday() {
        return this.isValid ? possiblyCachedLocalWeekData(this).weekday : NaN;
      }

      /**
       * Get the week number of the week year according to the locale. Different locales assign week numbers differently,
       * because the week can start on different days of the week (see localWeekday) and because a different number of days
       * is required for a week to count as the first week of a year.
       * @returns {number}
       */
      get localWeekNumber() {
        return this.isValid ? possiblyCachedLocalWeekData(this).weekNumber : NaN;
      }

      /**
       * Get the week year according to the locale. Different locales assign week numbers (and therefor week years)
       * differently, see localWeekNumber.
       * @returns {number}
       */
      get localWeekYear() {
        return this.isValid ? possiblyCachedLocalWeekData(this).weekYear : NaN;
      }

      /**
       * Get the ordinal (meaning the day of the year)
       * @example DateTime.local(2017, 5, 25).ordinal //=> 145
       * @type {number|DateTime}
       */
      get ordinal() {
        return this.isValid ? gregorianToOrdinal(this.c).ordinal : NaN;
      }

      /**
       * Get the human readable short month name, such as 'Oct'.
       * Defaults to the system's locale if no locale has been specified
       * @example DateTime.local(2017, 10, 30).monthShort //=> Oct
       * @type {string}
       */
      get monthShort() {
        return this.isValid ? Info.months("short", { locObj: this.loc })[this.month - 1] : null;
      }

      /**
       * Get the human readable long month name, such as 'October'.
       * Defaults to the system's locale if no locale has been specified
       * @example DateTime.local(2017, 10, 30).monthLong //=> October
       * @type {string}
       */
      get monthLong() {
        return this.isValid ? Info.months("long", { locObj: this.loc })[this.month - 1] : null;
      }

      /**
       * Get the human readable short weekday, such as 'Mon'.
       * Defaults to the system's locale if no locale has been specified
       * @example DateTime.local(2017, 10, 30).weekdayShort //=> Mon
       * @type {string}
       */
      get weekdayShort() {
        return this.isValid ? Info.weekdays("short", { locObj: this.loc })[this.weekday - 1] : null;
      }

      /**
       * Get the human readable long weekday, such as 'Monday'.
       * Defaults to the system's locale if no locale has been specified
       * @example DateTime.local(2017, 10, 30).weekdayLong //=> Monday
       * @type {string}
       */
      get weekdayLong() {
        return this.isValid ? Info.weekdays("long", { locObj: this.loc })[this.weekday - 1] : null;
      }

      /**
       * Get the UTC offset of this DateTime in minutes
       * @example DateTime.now().offset //=> -240
       * @example DateTime.utc().offset //=> 0
       * @type {number}
       */
      get offset() {
        return this.isValid ? +this.o : NaN;
      }

      /**
       * Get the short human name for the zone's current offset, for example "EST" or "EDT".
       * Defaults to the system's locale if no locale has been specified
       * @type {string}
       */
      get offsetNameShort() {
        if (this.isValid) {
          return this.zone.offsetName(this.ts, {
            format: "short",
            locale: this.locale,
          });
        } else {
          return null;
        }
      }

      /**
       * Get the long human name for the zone's current offset, for example "Eastern Standard Time" or "Eastern Daylight Time".
       * Defaults to the system's locale if no locale has been specified
       * @type {string}
       */
      get offsetNameLong() {
        if (this.isValid) {
          return this.zone.offsetName(this.ts, {
            format: "long",
            locale: this.locale,
          });
        } else {
          return null;
        }
      }

      /**
       * Get whether this zone's offset ever changes, as in a DST.
       * @type {boolean}
       */
      get isOffsetFixed() {
        return this.isValid ? this.zone.isUniversal : null;
      }

      /**
       * Get whether the DateTime is in a DST.
       * @type {boolean}
       */
      get isInDST() {
        if (this.isOffsetFixed) {
          return false;
        } else {
          return (
            this.offset > this.set({ month: 1, day: 1 }).offset ||
            this.offset > this.set({ month: 5 }).offset
          );
        }
      }

      /**
       * Get those DateTimes which have the same local time as this DateTime, but a different offset from UTC
       * in this DateTime's zone. During DST changes local time can be ambiguous, for example
       * `2023-10-29T02:30:00` in `Europe/Berlin` can have offset `+01:00` or `+02:00`.
       * This method will return both possible DateTimes if this DateTime's local time is ambiguous.
       * @returns {DateTime[]}
       */
      getPossibleOffsets() {
        if (!this.isValid || this.isOffsetFixed) {
          return [this];
        }
        const dayMs = 86400000;
        const minuteMs = 60000;
        const localTS = objToLocalTS(this.c);
        const oEarlier = this.zone.offset(localTS - dayMs);
        const oLater = this.zone.offset(localTS + dayMs);

        const o1 = this.zone.offset(localTS - oEarlier * minuteMs);
        const o2 = this.zone.offset(localTS - oLater * minuteMs);
        if (o1 === o2) {
          return [this];
        }
        const ts1 = localTS - o1 * minuteMs;
        const ts2 = localTS - o2 * minuteMs;
        const c1 = tsToObj(ts1, o1);
        const c2 = tsToObj(ts2, o2);
        if (
          c1.hour === c2.hour &&
          c1.minute === c2.minute &&
          c1.second === c2.second &&
          c1.millisecond === c2.millisecond
        ) {
          return [clone(this, { ts: ts1 }), clone(this, { ts: ts2 })];
        }
        return [this];
      }

      /**
       * Returns true if this DateTime is in a leap year, false otherwise
       * @example DateTime.local(2016).isInLeapYear //=> true
       * @example DateTime.local(2013).isInLeapYear //=> false
       * @type {boolean}
       */
      get isInLeapYear() {
        return isLeapYear(this.year);
      }

      /**
       * Returns the number of days in this DateTime's month
       * @example DateTime.local(2016, 2).daysInMonth //=> 29
       * @example DateTime.local(2016, 3).daysInMonth //=> 31
       * @type {number}
       */
      get daysInMonth() {
        return daysInMonth(this.year, this.month);
      }

      /**
       * Returns the number of days in this DateTime's year
       * @example DateTime.local(2016).daysInYear //=> 366
       * @example DateTime.local(2013).daysInYear //=> 365
       * @type {number}
       */
      get daysInYear() {
        return this.isValid ? daysInYear(this.year) : NaN;
      }

      /**
       * Returns the number of weeks in this DateTime's year
       * @see https://en.wikipedia.org/wiki/ISO_week_date
       * @example DateTime.local(2004).weeksInWeekYear //=> 53
       * @example DateTime.local(2013).weeksInWeekYear //=> 52
       * @type {number}
       */
      get weeksInWeekYear() {
        return this.isValid ? weeksInWeekYear(this.weekYear) : NaN;
      }

      /**
       * Returns the number of weeks in this DateTime's local week year
       * @example DateTime.local(2020, 6, {locale: 'en-US'}).weeksInLocalWeekYear //=> 52
       * @example DateTime.local(2020, 6, {locale: 'de-DE'}).weeksInLocalWeekYear //=> 53
       * @type {number}
       */
      get weeksInLocalWeekYear() {
        return this.isValid
          ? weeksInWeekYear(
              this.localWeekYear,
              this.loc.getMinDaysInFirstWeek(),
              this.loc.getStartOfWeek()
            )
          : NaN;
      }

      /**
       * Returns the resolved Intl options for this DateTime.
       * This is useful in understanding the behavior of formatting methods
       * @param {Object} opts - the same options as toLocaleString
       * @return {Object}
       */
      resolvedLocaleOptions(opts = {}) {
        const { locale, numberingSystem, calendar } = Formatter.create(
          this.loc.clone(opts),
          opts
        ).resolvedOptions(this);
        return { locale, numberingSystem, outputCalendar: calendar };
      }

      // TRANSFORM

      /**
       * "Set" the DateTime's zone to UTC. Returns a newly-constructed DateTime.
       *
       * Equivalent to {@link DateTime#setZone}('utc')
       * @param {number} [offset=0] - optionally, an offset from UTC in minutes
       * @param {Object} [opts={}] - options to pass to `setZone()`
       * @return {DateTime}
       */
      toUTC(offset = 0, opts = {}) {
        return this.setZone(FixedOffsetZone.instance(offset), opts);
      }

      /**
       * "Set" the DateTime's zone to the host's local zone. Returns a newly-constructed DateTime.
       *
       * Equivalent to `setZone('local')`
       * @return {DateTime}
       */
      toLocal() {
        return this.setZone(Settings.defaultZone);
      }

      /**
       * "Set" the DateTime's zone to specified zone. Returns a newly-constructed DateTime.
       *
       * By default, the setter keeps the underlying time the same (as in, the same timestamp), but the new instance will report different local times and consider DSTs when making computations, as with {@link DateTime#plus}. You may wish to use {@link DateTime#toLocal} and {@link DateTime#toUTC} which provide simple convenience wrappers for commonly used zones.
       * @param {string|Zone} [zone='local'] - a zone identifier. As a string, that can be any IANA zone supported by the host environment, or a fixed-offset name of the form 'UTC+3', or the strings 'local' or 'utc'. You may also supply an instance of a {@link DateTime#Zone} class.
       * @param {Object} opts - options
       * @param {boolean} [opts.keepLocalTime=false] - If true, adjust the underlying time so that the local time stays the same, but in the target zone. You should rarely need this.
       * @return {DateTime}
       */
      setZone(zone, { keepLocalTime = false, keepCalendarTime = false } = {}) {
        zone = normalizeZone(zone, Settings.defaultZone);
        if (zone.equals(this.zone)) {
          return this;
        } else if (!zone.isValid) {
          return DateTime.invalid(unsupportedZone(zone));
        } else {
          let newTS = this.ts;
          if (keepLocalTime || keepCalendarTime) {
            const offsetGuess = zone.offset(this.ts);
            const asObj = this.toObject();
            [newTS] = objToTS(asObj, offsetGuess, zone);
          }
          return clone(this, { ts: newTS, zone });
        }
      }

      /**
       * "Set" the locale, numberingSystem, or outputCalendar. Returns a newly-constructed DateTime.
       * @param {Object} properties - the properties to set
       * @example DateTime.local(2017, 5, 25).reconfigure({ locale: 'en-GB' })
       * @return {DateTime}
       */
      reconfigure({ locale, numberingSystem, outputCalendar } = {}) {
        const loc = this.loc.clone({ locale, numberingSystem, outputCalendar });
        return clone(this, { loc });
      }

      /**
       * "Set" the locale. Returns a newly-constructed DateTime.
       * Just a convenient alias for reconfigure({ locale })
       * @example DateTime.local(2017, 5, 25).setLocale('en-GB')
       * @return {DateTime}
       */
      setLocale(locale) {
        return this.reconfigure({ locale });
      }

      /**
       * "Set" the values of specified units. Returns a newly-constructed DateTime.
       * You can only set units with this method; for "setting" metadata, see {@link DateTime#reconfigure} and {@link DateTime#setZone}.
       *
       * This method also supports setting locale-based week units, i.e. `localWeekday`, `localWeekNumber` and `localWeekYear`.
       * They cannot be mixed with ISO-week units like `weekday`.
       * @param {Object} values - a mapping of units to numbers
       * @example dt.set({ year: 2017 })
       * @example dt.set({ hour: 8, minute: 30 })
       * @example dt.set({ weekday: 5 })
       * @example dt.set({ year: 2005, ordinal: 234 })
       * @return {DateTime}
       */
      set(values) {
        if (!this.isValid) return this;

        const normalized = normalizeObject(values, normalizeUnitWithLocalWeeks);
        const { minDaysInFirstWeek, startOfWeek } = usesLocalWeekValues(normalized, this.loc);

        const settingWeekStuff =
            !isUndefined(normalized.weekYear) ||
            !isUndefined(normalized.weekNumber) ||
            !isUndefined(normalized.weekday),
          containsOrdinal = !isUndefined(normalized.ordinal),
          containsGregorYear = !isUndefined(normalized.year),
          containsGregorMD = !isUndefined(normalized.month) || !isUndefined(normalized.day),
          containsGregor = containsGregorYear || containsGregorMD,
          definiteWeekDef = normalized.weekYear || normalized.weekNumber;

        if ((containsGregor || containsOrdinal) && definiteWeekDef) {
          throw new ConflictingSpecificationError(
            "Can't mix weekYear/weekNumber units with year/month/day or ordinals"
          );
        }

        if (containsGregorMD && containsOrdinal) {
          throw new ConflictingSpecificationError("Can't mix ordinal dates with month/day");
        }

        let mixed;
        if (settingWeekStuff) {
          mixed = weekToGregorian(
            { ...gregorianToWeek(this.c, minDaysInFirstWeek, startOfWeek), ...normalized },
            minDaysInFirstWeek,
            startOfWeek
          );
        } else if (!isUndefined(normalized.ordinal)) {
          mixed = ordinalToGregorian({ ...gregorianToOrdinal(this.c), ...normalized });
        } else {
          mixed = { ...this.toObject(), ...normalized };

          // if we didn't set the day but we ended up on an overflow date,
          // use the last day of the right month
          if (isUndefined(normalized.day)) {
            mixed.day = Math.min(daysInMonth(mixed.year, mixed.month), mixed.day);
          }
        }

        const [ts, o] = objToTS(mixed, this.o, this.zone);
        return clone(this, { ts, o });
      }

      /**
       * Add a period of time to this DateTime and return the resulting DateTime
       *
       * Adding hours, minutes, seconds, or milliseconds increases the timestamp by the right number of milliseconds. Adding days, months, or years shifts the calendar, accounting for DSTs and leap years along the way. Thus, `dt.plus({ hours: 24 })` may result in a different time than `dt.plus({ days: 1 })` if there's a DST shift in between.
       * @param {Duration|Object|number} duration - The amount to add. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
       * @example DateTime.now().plus(123) //~> in 123 milliseconds
       * @example DateTime.now().plus({ minutes: 15 }) //~> in 15 minutes
       * @example DateTime.now().plus({ days: 1 }) //~> this time tomorrow
       * @example DateTime.now().plus({ days: -1 }) //~> this time yesterday
       * @example DateTime.now().plus({ hours: 3, minutes: 13 }) //~> in 3 hr, 13 min
       * @example DateTime.now().plus(Duration.fromObject({ hours: 3, minutes: 13 })) //~> in 3 hr, 13 min
       * @return {DateTime}
       */
      plus(duration) {
        if (!this.isValid) return this;
        const dur = Duration.fromDurationLike(duration);
        return clone(this, adjustTime(this, dur));
      }

      /**
       * Subtract a period of time to this DateTime and return the resulting DateTime
       * See {@link DateTime#plus}
       * @param {Duration|Object|number} duration - The amount to subtract. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
       @return {DateTime}
       */
      minus(duration) {
        if (!this.isValid) return this;
        const dur = Duration.fromDurationLike(duration).negate();
        return clone(this, adjustTime(this, dur));
      }

      /**
       * "Set" this DateTime to the beginning of a unit of time.
       * @param {string} unit - The unit to go to the beginning of. Can be 'year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', or 'millisecond'.
       * @param {Object} opts - options
       * @param {boolean} [opts.useLocaleWeeks=false] - If true, use weeks based on the locale, i.e. use the locale-dependent start of the week
       * @example DateTime.local(2014, 3, 3).startOf('month').toISODate(); //=> '2014-03-01'
       * @example DateTime.local(2014, 3, 3).startOf('year').toISODate(); //=> '2014-01-01'
       * @example DateTime.local(2014, 3, 3).startOf('week').toISODate(); //=> '2014-03-03', weeks always start on Mondays
       * @example DateTime.local(2014, 3, 3, 5, 30).startOf('day').toISOTime(); //=> '00:00.000-05:00'
       * @example DateTime.local(2014, 3, 3, 5, 30).startOf('hour').toISOTime(); //=> '05:00:00.000-05:00'
       * @return {DateTime}
       */
      startOf(unit, { useLocaleWeeks = false } = {}) {
        if (!this.isValid) return this;

        const o = {},
          normalizedUnit = Duration.normalizeUnit(unit);
        switch (normalizedUnit) {
          case "years":
            o.month = 1;
          // falls through
          case "quarters":
          case "months":
            o.day = 1;
          // falls through
          case "weeks":
          case "days":
            o.hour = 0;
          // falls through
          case "hours":
            o.minute = 0;
          // falls through
          case "minutes":
            o.second = 0;
          // falls through
          case "seconds":
            o.millisecond = 0;
            break;
          // no default, invalid units throw in normalizeUnit()
        }

        if (normalizedUnit === "weeks") {
          if (useLocaleWeeks) {
            const startOfWeek = this.loc.getStartOfWeek();
            const { weekday } = this;
            if (weekday < startOfWeek) {
              o.weekNumber = this.weekNumber - 1;
            }
            o.weekday = startOfWeek;
          } else {
            o.weekday = 1;
          }
        }

        if (normalizedUnit === "quarters") {
          const q = Math.ceil(this.month / 3);
          o.month = (q - 1) * 3 + 1;
        }

        return this.set(o);
      }

      /**
       * "Set" this DateTime to the end (meaning the last millisecond) of a unit of time
       * @param {string} unit - The unit to go to the end of. Can be 'year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', or 'millisecond'.
       * @param {Object} opts - options
       * @param {boolean} [opts.useLocaleWeeks=false] - If true, use weeks based on the locale, i.e. use the locale-dependent start of the week
       * @example DateTime.local(2014, 3, 3).endOf('month').toISO(); //=> '2014-03-31T23:59:59.999-05:00'
       * @example DateTime.local(2014, 3, 3).endOf('year').toISO(); //=> '2014-12-31T23:59:59.999-05:00'
       * @example DateTime.local(2014, 3, 3).endOf('week').toISO(); // => '2014-03-09T23:59:59.999-05:00', weeks start on Mondays
       * @example DateTime.local(2014, 3, 3, 5, 30).endOf('day').toISO(); //=> '2014-03-03T23:59:59.999-05:00'
       * @example DateTime.local(2014, 3, 3, 5, 30).endOf('hour').toISO(); //=> '2014-03-03T05:59:59.999-05:00'
       * @return {DateTime}
       */
      endOf(unit, opts) {
        return this.isValid
          ? this.plus({ [unit]: 1 })
              .startOf(unit, opts)
              .minus(1)
          : this;
      }

      // OUTPUT

      /**
       * Returns a string representation of this DateTime formatted according to the specified format string.
       * **You may not want this.** See {@link DateTime#toLocaleString} for a more flexible formatting tool. For a table of tokens and their interpretations, see [here](https://moment.github.io/luxon/#/formatting?id=table-of-tokens).
       * Defaults to en-US if no locale has been specified, regardless of the system's locale.
       * @param {string} fmt - the format string
       * @param {Object} opts - opts to override the configuration options on this DateTime
       * @example DateTime.now().toFormat('yyyy LLL dd') //=> '2017 Apr 22'
       * @example DateTime.now().setLocale('fr').toFormat('yyyy LLL dd') //=> '2017 avr. 22'
       * @example DateTime.now().toFormat('yyyy LLL dd', { locale: "fr" }) //=> '2017 avr. 22'
       * @example DateTime.now().toFormat("HH 'hours and' mm 'minutes'") //=> '20 hours and 55 minutes'
       * @return {string}
       */
      toFormat(fmt, opts = {}) {
        return this.isValid
          ? Formatter.create(this.loc.redefaultToEN(opts)).formatDateTimeFromString(this, fmt)
          : INVALID;
      }

      /**
       * Returns a localized string representing this date. Accepts the same options as the Intl.DateTimeFormat constructor and any presets defined by Luxon, such as `DateTime.DATE_FULL` or `DateTime.TIME_SIMPLE`.
       * The exact behavior of this method is browser-specific, but in general it will return an appropriate representation
       * of the DateTime in the assigned locale.
       * Defaults to the system's locale if no locale has been specified
       * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
       * @param formatOpts {Object} - Intl.DateTimeFormat constructor options and configuration options
       * @param {Object} opts - opts to override the configuration options on this DateTime
       * @example DateTime.now().toLocaleString(); //=> 4/20/2017
       * @example DateTime.now().setLocale('en-gb').toLocaleString(); //=> '20/04/2017'
       * @example DateTime.now().toLocaleString(DateTime.DATE_FULL); //=> 'April 20, 2017'
       * @example DateTime.now().toLocaleString(DateTime.DATE_FULL, { locale: 'fr' }); //=> '28 août 2022'
       * @example DateTime.now().toLocaleString(DateTime.TIME_SIMPLE); //=> '11:32 AM'
       * @example DateTime.now().toLocaleString(DateTime.DATETIME_SHORT); //=> '4/20/2017, 11:32 AM'
       * @example DateTime.now().toLocaleString({ weekday: 'long', month: 'long', day: '2-digit' }); //=> 'Thursday, April 20'
       * @example DateTime.now().toLocaleString({ weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }); //=> 'Thu, Apr 20, 11:27 AM'
       * @example DateTime.now().toLocaleString({ hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }); //=> '11:32'
       * @return {string}
       */
      toLocaleString(formatOpts = DATE_SHORT, opts = {}) {
        return this.isValid
          ? Formatter.create(this.loc.clone(opts), formatOpts).formatDateTime(this)
          : INVALID;
      }

      /**
       * Returns an array of format "parts", meaning individual tokens along with metadata. This is allows callers to post-process individual sections of the formatted output.
       * Defaults to the system's locale if no locale has been specified
       * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat/formatToParts
       * @param opts {Object} - Intl.DateTimeFormat constructor options, same as `toLocaleString`.
       * @example DateTime.now().toLocaleParts(); //=> [
       *                                   //=>   { type: 'day', value: '25' },
       *                                   //=>   { type: 'literal', value: '/' },
       *                                   //=>   { type: 'month', value: '05' },
       *                                   //=>   { type: 'literal', value: '/' },
       *                                   //=>   { type: 'year', value: '1982' }
       *                                   //=> ]
       */
      toLocaleParts(opts = {}) {
        return this.isValid
          ? Formatter.create(this.loc.clone(opts), opts).formatDateTimeParts(this)
          : [];
      }

      /**
       * Returns an ISO 8601-compliant string representation of this DateTime
       * @param {Object} opts - options
       * @param {boolean} [opts.suppressMilliseconds=false] - exclude milliseconds from the format if they're 0
       * @param {boolean} [opts.suppressSeconds=false] - exclude seconds from the format if they're 0
       * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
       * @param {boolean} [opts.extendedZone=false] - add the time zone format extension
       * @param {string} [opts.format='extended'] - choose between the basic and extended format
       * @example DateTime.utc(1983, 5, 25).toISO() //=> '1982-05-25T00:00:00.000Z'
       * @example DateTime.now().toISO() //=> '2017-04-22T20:47:05.335-04:00'
       * @example DateTime.now().toISO({ includeOffset: false }) //=> '2017-04-22T20:47:05.335'
       * @example DateTime.now().toISO({ format: 'basic' }) //=> '20170422T204705.335-0400'
       * @return {string|null}
       */
      toISO({
        format = "extended",
        suppressSeconds = false,
        suppressMilliseconds = false,
        includeOffset = true,
        extendedZone = false,
      } = {}) {
        if (!this.isValid) {
          return null;
        }

        const ext = format === "extended";

        let c = toISODate(this, ext);
        c += "T";
        c += toISOTime(this, ext, suppressSeconds, suppressMilliseconds, includeOffset, extendedZone);
        return c;
      }

      /**
       * Returns an ISO 8601-compliant string representation of this DateTime's date component
       * @param {Object} opts - options
       * @param {string} [opts.format='extended'] - choose between the basic and extended format
       * @example DateTime.utc(1982, 5, 25).toISODate() //=> '1982-05-25'
       * @example DateTime.utc(1982, 5, 25).toISODate({ format: 'basic' }) //=> '19820525'
       * @return {string|null}
       */
      toISODate({ format = "extended" } = {}) {
        if (!this.isValid) {
          return null;
        }

        return toISODate(this, format === "extended");
      }

      /**
       * Returns an ISO 8601-compliant string representation of this DateTime's week date
       * @example DateTime.utc(1982, 5, 25).toISOWeekDate() //=> '1982-W21-2'
       * @return {string}
       */
      toISOWeekDate() {
        return toTechFormat(this, "kkkk-'W'WW-c");
      }

      /**
       * Returns an ISO 8601-compliant string representation of this DateTime's time component
       * @param {Object} opts - options
       * @param {boolean} [opts.suppressMilliseconds=false] - exclude milliseconds from the format if they're 0
       * @param {boolean} [opts.suppressSeconds=false] - exclude seconds from the format if they're 0
       * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
       * @param {boolean} [opts.extendedZone=true] - add the time zone format extension
       * @param {boolean} [opts.includePrefix=false] - include the `T` prefix
       * @param {string} [opts.format='extended'] - choose between the basic and extended format
       * @example DateTime.utc().set({ hour: 7, minute: 34 }).toISOTime() //=> '07:34:19.361Z'
       * @example DateTime.utc().set({ hour: 7, minute: 34, seconds: 0, milliseconds: 0 }).toISOTime({ suppressSeconds: true }) //=> '07:34Z'
       * @example DateTime.utc().set({ hour: 7, minute: 34 }).toISOTime({ format: 'basic' }) //=> '073419.361Z'
       * @example DateTime.utc().set({ hour: 7, minute: 34 }).toISOTime({ includePrefix: true }) //=> 'T07:34:19.361Z'
       * @return {string}
       */
      toISOTime({
        suppressMilliseconds = false,
        suppressSeconds = false,
        includeOffset = true,
        includePrefix = false,
        extendedZone = false,
        format = "extended",
      } = {}) {
        if (!this.isValid) {
          return null;
        }

        let c = includePrefix ? "T" : "";
        return (
          c +
          toISOTime(
            this,
            format === "extended",
            suppressSeconds,
            suppressMilliseconds,
            includeOffset,
            extendedZone
          )
        );
      }

      /**
       * Returns an RFC 2822-compatible string representation of this DateTime
       * @example DateTime.utc(2014, 7, 13).toRFC2822() //=> 'Sun, 13 Jul 2014 00:00:00 +0000'
       * @example DateTime.local(2014, 7, 13).toRFC2822() //=> 'Sun, 13 Jul 2014 00:00:00 -0400'
       * @return {string}
       */
      toRFC2822() {
        return toTechFormat(this, "EEE, dd LLL yyyy HH:mm:ss ZZZ", false);
      }

      /**
       * Returns a string representation of this DateTime appropriate for use in HTTP headers. The output is always expressed in GMT.
       * Specifically, the string conforms to RFC 1123.
       * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.3.1
       * @example DateTime.utc(2014, 7, 13).toHTTP() //=> 'Sun, 13 Jul 2014 00:00:00 GMT'
       * @example DateTime.utc(2014, 7, 13, 19).toHTTP() //=> 'Sun, 13 Jul 2014 19:00:00 GMT'
       * @return {string}
       */
      toHTTP() {
        return toTechFormat(this.toUTC(), "EEE, dd LLL yyyy HH:mm:ss 'GMT'");
      }

      /**
       * Returns a string representation of this DateTime appropriate for use in SQL Date
       * @example DateTime.utc(2014, 7, 13).toSQLDate() //=> '2014-07-13'
       * @return {string|null}
       */
      toSQLDate() {
        if (!this.isValid) {
          return null;
        }
        return toISODate(this, true);
      }

      /**
       * Returns a string representation of this DateTime appropriate for use in SQL Time
       * @param {Object} opts - options
       * @param {boolean} [opts.includeZone=false] - include the zone, such as 'America/New_York'. Overrides includeOffset.
       * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
       * @param {boolean} [opts.includeOffsetSpace=true] - include the space between the time and the offset, such as '05:15:16.345 -04:00'
       * @example DateTime.utc().toSQL() //=> '05:15:16.345'
       * @example DateTime.now().toSQL() //=> '05:15:16.345 -04:00'
       * @example DateTime.now().toSQL({ includeOffset: false }) //=> '05:15:16.345'
       * @example DateTime.now().toSQL({ includeZone: false }) //=> '05:15:16.345 America/New_York'
       * @return {string}
       */
      toSQLTime({ includeOffset = true, includeZone = false, includeOffsetSpace = true } = {}) {
        let fmt = "HH:mm:ss.SSS";

        if (includeZone || includeOffset) {
          if (includeOffsetSpace) {
            fmt += " ";
          }
          if (includeZone) {
            fmt += "z";
          } else if (includeOffset) {
            fmt += "ZZ";
          }
        }

        return toTechFormat(this, fmt, true);
      }

      /**
       * Returns a string representation of this DateTime appropriate for use in SQL DateTime
       * @param {Object} opts - options
       * @param {boolean} [opts.includeZone=false] - include the zone, such as 'America/New_York'. Overrides includeOffset.
       * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
       * @param {boolean} [opts.includeOffsetSpace=true] - include the space between the time and the offset, such as '05:15:16.345 -04:00'
       * @example DateTime.utc(2014, 7, 13).toSQL() //=> '2014-07-13 00:00:00.000 Z'
       * @example DateTime.local(2014, 7, 13).toSQL() //=> '2014-07-13 00:00:00.000 -04:00'
       * @example DateTime.local(2014, 7, 13).toSQL({ includeOffset: false }) //=> '2014-07-13 00:00:00.000'
       * @example DateTime.local(2014, 7, 13).toSQL({ includeZone: true }) //=> '2014-07-13 00:00:00.000 America/New_York'
       * @return {string}
       */
      toSQL(opts = {}) {
        if (!this.isValid) {
          return null;
        }

        return `${this.toSQLDate()} ${this.toSQLTime(opts)}`;
      }

      /**
       * Returns a string representation of this DateTime appropriate for debugging
       * @return {string}
       */
      toString() {
        return this.isValid ? this.toISO() : INVALID;
      }

      /**
       * Returns a string representation of this DateTime appropriate for the REPL.
       * @return {string}
       */
      [Symbol.for("nodejs.util.inspect.custom")]() {
        if (this.isValid) {
          return `DateTime { ts: ${this.toISO()}, zone: ${this.zone.name}, locale: ${this.locale} }`;
        } else {
          return `DateTime { Invalid, reason: ${this.invalidReason} }`;
        }
      }

      /**
       * Returns the epoch milliseconds of this DateTime. Alias of {@link DateTime#toMillis}
       * @return {number}
       */
      valueOf() {
        return this.toMillis();
      }

      /**
       * Returns the epoch milliseconds of this DateTime.
       * @return {number}
       */
      toMillis() {
        return this.isValid ? this.ts : NaN;
      }

      /**
       * Returns the epoch seconds (including milliseconds in the fractional part) of this DateTime.
       * @return {number}
       */
      toSeconds() {
        return this.isValid ? this.ts / 1000 : NaN;
      }

      /**
       * Returns the epoch seconds (as a whole number) of this DateTime.
       * @return {number}
       */
      toUnixInteger() {
        return this.isValid ? Math.floor(this.ts / 1000) : NaN;
      }

      /**
       * Returns an ISO 8601 representation of this DateTime appropriate for use in JSON.
       * @return {string}
       */
      toJSON() {
        return this.toISO();
      }

      /**
       * Returns a BSON serializable equivalent to this DateTime.
       * @return {Date}
       */
      toBSON() {
        return this.toJSDate();
      }

      /**
       * Returns a JavaScript object with this DateTime's year, month, day, and so on.
       * @param opts - options for generating the object
       * @param {boolean} [opts.includeConfig=false] - include configuration attributes in the output
       * @example DateTime.now().toObject() //=> { year: 2017, month: 4, day: 22, hour: 20, minute: 49, second: 42, millisecond: 268 }
       * @return {Object}
       */
      toObject(opts = {}) {
        if (!this.isValid) return {};

        const base = { ...this.c };

        if (opts.includeConfig) {
          base.outputCalendar = this.outputCalendar;
          base.numberingSystem = this.loc.numberingSystem;
          base.locale = this.loc.locale;
        }
        return base;
      }

      /**
       * Returns a JavaScript Date equivalent to this DateTime.
       * @return {Date}
       */
      toJSDate() {
        return new Date(this.isValid ? this.ts : NaN);
      }

      // COMPARE

      /**
       * Return the difference between two DateTimes as a Duration.
       * @param {DateTime} otherDateTime - the DateTime to compare this one to
       * @param {string|string[]} [unit=['milliseconds']] - the unit or array of units (such as 'hours' or 'days') to include in the duration.
       * @param {Object} opts - options that affect the creation of the Duration
       * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
       * @example
       * var i1 = DateTime.fromISO('1982-05-25T09:45'),
       *     i2 = DateTime.fromISO('1983-10-14T10:30');
       * i2.diff(i1).toObject() //=> { milliseconds: 43807500000 }
       * i2.diff(i1, 'hours').toObject() //=> { hours: 12168.75 }
       * i2.diff(i1, ['months', 'days']).toObject() //=> { months: 16, days: 19.03125 }
       * i2.diff(i1, ['months', 'days', 'hours']).toObject() //=> { months: 16, days: 19, hours: 0.75 }
       * @return {Duration}
       */
      diff(otherDateTime, unit = "milliseconds", opts = {}) {
        if (!this.isValid || !otherDateTime.isValid) {
          return Duration.invalid("created by diffing an invalid DateTime");
        }

        const durOpts = { locale: this.locale, numberingSystem: this.numberingSystem, ...opts };

        const units = maybeArray(unit).map(Duration.normalizeUnit),
          otherIsLater = otherDateTime.valueOf() > this.valueOf(),
          earlier = otherIsLater ? this : otherDateTime,
          later = otherIsLater ? otherDateTime : this,
          diffed = diff(earlier, later, units, durOpts);

        return otherIsLater ? diffed.negate() : diffed;
      }

      /**
       * Return the difference between this DateTime and right now.
       * See {@link DateTime#diff}
       * @param {string|string[]} [unit=['milliseconds']] - the unit or units units (such as 'hours' or 'days') to include in the duration
       * @param {Object} opts - options that affect the creation of the Duration
       * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
       * @return {Duration}
       */
      diffNow(unit = "milliseconds", opts = {}) {
        return this.diff(DateTime.now(), unit, opts);
      }

      /**
       * Return an Interval spanning between this DateTime and another DateTime
       * @param {DateTime} otherDateTime - the other end point of the Interval
       * @return {Interval|DateTime}
       */
      until(otherDateTime) {
        return this.isValid ? Interval.fromDateTimes(this, otherDateTime) : this;
      }

      /**
       * Return whether this DateTime is in the same unit of time as another DateTime.
       * Higher-order units must also be identical for this function to return `true`.
       * Note that time zones are **ignored** in this comparison, which compares the **local** calendar time. Use {@link DateTime#setZone} to convert one of the dates if needed.
       * @param {DateTime} otherDateTime - the other DateTime
       * @param {string} unit - the unit of time to check sameness on
       * @param {Object} opts - options
       * @param {boolean} [opts.useLocaleWeeks=false] - If true, use weeks based on the locale, i.e. use the locale-dependent start of the week; only the locale of this DateTime is used
       * @example DateTime.now().hasSame(otherDT, 'day'); //~> true if otherDT is in the same current calendar day
       * @return {boolean}
       */
      hasSame(otherDateTime, unit, opts) {
        if (!this.isValid) return false;

        const inputMs = otherDateTime.valueOf();
        const adjustedToZone = this.setZone(otherDateTime.zone, { keepLocalTime: true });
        return (
          adjustedToZone.startOf(unit, opts) <= inputMs && inputMs <= adjustedToZone.endOf(unit, opts)
        );
      }

      /**
       * Equality check
       * Two DateTimes are equal if and only if they represent the same millisecond, have the same zone and location, and are both valid.
       * To compare just the millisecond values, use `+dt1 === +dt2`.
       * @param {DateTime} other - the other DateTime
       * @return {boolean}
       */
      equals(other) {
        return (
          this.isValid &&
          other.isValid &&
          this.valueOf() === other.valueOf() &&
          this.zone.equals(other.zone) &&
          this.loc.equals(other.loc)
        );
      }

      /**
       * Returns a string representation of a this time relative to now, such as "in two days". Can only internationalize if your
       * platform supports Intl.RelativeTimeFormat. Rounds down by default.
       * @param {Object} options - options that affect the output
       * @param {DateTime} [options.base=DateTime.now()] - the DateTime to use as the basis to which this time is compared. Defaults to now.
       * @param {string} [options.style="long"] - the style of units, must be "long", "short", or "narrow"
       * @param {string|string[]} options.unit - use a specific unit or array of units; if omitted, or an array, the method will pick the best unit. Use an array or one of "years", "quarters", "months", "weeks", "days", "hours", "minutes", or "seconds"
       * @param {boolean} [options.round=true] - whether to round the numbers in the output.
       * @param {number} [options.padding=0] - padding in milliseconds. This allows you to round up the result if it fits inside the threshold. Don't use in combination with {round: false} because the decimal output will include the padding.
       * @param {string} options.locale - override the locale of this DateTime
       * @param {string} options.numberingSystem - override the numberingSystem of this DateTime. The Intl system may choose not to honor this
       * @example DateTime.now().plus({ days: 1 }).toRelative() //=> "in 1 day"
       * @example DateTime.now().setLocale("es").toRelative({ days: 1 }) //=> "dentro de 1 día"
       * @example DateTime.now().plus({ days: 1 }).toRelative({ locale: "fr" }) //=> "dans 23 heures"
       * @example DateTime.now().minus({ days: 2 }).toRelative() //=> "2 days ago"
       * @example DateTime.now().minus({ days: 2 }).toRelative({ unit: "hours" }) //=> "48 hours ago"
       * @example DateTime.now().minus({ hours: 36 }).toRelative({ round: false }) //=> "1.5 days ago"
       */
      toRelative(options = {}) {
        if (!this.isValid) return null;
        const base = options.base || DateTime.fromObject({}, { zone: this.zone }),
          padding = options.padding ? (this < base ? -options.padding : options.padding) : 0;
        let units = ["years", "months", "days", "hours", "minutes", "seconds"];
        let unit = options.unit;
        if (Array.isArray(options.unit)) {
          units = options.unit;
          unit = undefined;
        }
        return diffRelative(base, this.plus(padding), {
          ...options,
          numeric: "always",
          units,
          unit,
        });
      }

      /**
       * Returns a string representation of this date relative to today, such as "yesterday" or "next month".
       * Only internationalizes on platforms that supports Intl.RelativeTimeFormat.
       * @param {Object} options - options that affect the output
       * @param {DateTime} [options.base=DateTime.now()] - the DateTime to use as the basis to which this time is compared. Defaults to now.
       * @param {string} options.locale - override the locale of this DateTime
       * @param {string} options.unit - use a specific unit; if omitted, the method will pick the unit. Use one of "years", "quarters", "months", "weeks", or "days"
       * @param {string} options.numberingSystem - override the numberingSystem of this DateTime. The Intl system may choose not to honor this
       * @example DateTime.now().plus({ days: 1 }).toRelativeCalendar() //=> "tomorrow"
       * @example DateTime.now().setLocale("es").plus({ days: 1 }).toRelative() //=> ""mañana"
       * @example DateTime.now().plus({ days: 1 }).toRelativeCalendar({ locale: "fr" }) //=> "demain"
       * @example DateTime.now().minus({ days: 2 }).toRelativeCalendar() //=> "2 days ago"
       */
      toRelativeCalendar(options = {}) {
        if (!this.isValid) return null;

        return diffRelative(options.base || DateTime.fromObject({}, { zone: this.zone }), this, {
          ...options,
          numeric: "auto",
          units: ["years", "months", "days"],
          calendary: true,
        });
      }

      /**
       * Return the min of several date times
       * @param {...DateTime} dateTimes - the DateTimes from which to choose the minimum
       * @return {DateTime} the min DateTime, or undefined if called with no argument
       */
      static min(...dateTimes) {
        if (!dateTimes.every(DateTime.isDateTime)) {
          throw new InvalidArgumentError("min requires all arguments be DateTimes");
        }
        return bestBy(dateTimes, (i) => i.valueOf(), Math.min);
      }

      /**
       * Return the max of several date times
       * @param {...DateTime} dateTimes - the DateTimes from which to choose the maximum
       * @return {DateTime} the max DateTime, or undefined if called with no argument
       */
      static max(...dateTimes) {
        if (!dateTimes.every(DateTime.isDateTime)) {
          throw new InvalidArgumentError("max requires all arguments be DateTimes");
        }
        return bestBy(dateTimes, (i) => i.valueOf(), Math.max);
      }

      // MISC

      /**
       * Explain how a string would be parsed by fromFormat()
       * @param {string} text - the string to parse
       * @param {string} fmt - the format the string is expected to be in (see description)
       * @param {Object} options - options taken by fromFormat()
       * @return {Object}
       */
      static fromFormatExplain(text, fmt, options = {}) {
        const { locale = null, numberingSystem = null } = options,
          localeToUse = Locale.fromOpts({
            locale,
            numberingSystem,
            defaultToEN: true,
          });
        return explainFromTokens(localeToUse, text, fmt);
      }

      /**
       * @deprecated use fromFormatExplain instead
       */
      static fromStringExplain(text, fmt, options = {}) {
        return DateTime.fromFormatExplain(text, fmt, options);
      }

      /**
       * Build a parser for `fmt` using the given locale. This parser can be passed
       * to {@link DateTime.fromFormatParser} to a parse a date in this format. This
       * can be used to optimize cases where many dates need to be parsed in a
       * specific format.
       *
       * @param {String} fmt - the format the string is expected to be in (see
       * description)
       * @param {Object} options - options used to set locale and numberingSystem
       * for parser
       * @returns {TokenParser} - opaque object to be used
       */
      static buildFormatParser(fmt, options = {}) {
        const { locale = null, numberingSystem = null } = options,
          localeToUse = Locale.fromOpts({
            locale,
            numberingSystem,
            defaultToEN: true,
          });
        return new TokenParser(localeToUse, fmt);
      }

      /**
       * Create a DateTime from an input string and format parser.
       *
       * The format parser must have been created with the same locale as this call.
       *
       * @param {String} text - the string to parse
       * @param {TokenParser} formatParser - parser from {@link DateTime.buildFormatParser}
       * @param {Object} opts - options taken by fromFormat()
       * @returns {DateTime}
       */
      static fromFormatParser(text, formatParser, opts = {}) {
        if (isUndefined(text) || isUndefined(formatParser)) {
          throw new InvalidArgumentError(
            "fromFormatParser requires an input string and a format parser"
          );
        }
        const { locale = null, numberingSystem = null } = opts,
          localeToUse = Locale.fromOpts({
            locale,
            numberingSystem,
            defaultToEN: true,
          });

        if (!localeToUse.equals(formatParser.locale)) {
          throw new InvalidArgumentError(
            `fromFormatParser called with a locale of ${localeToUse}, ` +
              `but the format parser was created for ${formatParser.locale}`
          );
        }

        const { result, zone, specificOffset, invalidReason } = formatParser.explainFromTokens(text);

        if (invalidReason) {
          return DateTime.invalid(invalidReason);
        } else {
          return parseDataToDateTime(
            result,
            zone,
            opts,
            `format ${formatParser.format}`,
            text,
            specificOffset
          );
        }
      }

      // FORMAT PRESETS

      /**
       * {@link DateTime#toLocaleString} format like 10/14/1983
       * @type {Object}
       */
      static get DATE_SHORT() {
        return DATE_SHORT;
      }

      /**
       * {@link DateTime#toLocaleString} format like 'Oct 14, 1983'
       * @type {Object}
       */
      static get DATE_MED() {
        return DATE_MED;
      }

      /**
       * {@link DateTime#toLocaleString} format like 'Fri, Oct 14, 1983'
       * @type {Object}
       */
      static get DATE_MED_WITH_WEEKDAY() {
        return DATE_MED_WITH_WEEKDAY;
      }

      /**
       * {@link DateTime#toLocaleString} format like 'October 14, 1983'
       * @type {Object}
       */
      static get DATE_FULL() {
        return DATE_FULL;
      }

      /**
       * {@link DateTime#toLocaleString} format like 'Tuesday, October 14, 1983'
       * @type {Object}
       */
      static get DATE_HUGE() {
        return DATE_HUGE;
      }

      /**
       * {@link DateTime#toLocaleString} format like '09:30 AM'. Only 12-hour if the locale is.
       * @type {Object}
       */
      static get TIME_SIMPLE() {
        return TIME_SIMPLE;
      }

      /**
       * {@link DateTime#toLocaleString} format like '09:30:23 AM'. Only 12-hour if the locale is.
       * @type {Object}
       */
      static get TIME_WITH_SECONDS() {
        return TIME_WITH_SECONDS;
      }

      /**
       * {@link DateTime#toLocaleString} format like '09:30:23 AM EDT'. Only 12-hour if the locale is.
       * @type {Object}
       */
      static get TIME_WITH_SHORT_OFFSET() {
        return TIME_WITH_SHORT_OFFSET;
      }

      /**
       * {@link DateTime#toLocaleString} format like '09:30:23 AM Eastern Daylight Time'. Only 12-hour if the locale is.
       * @type {Object}
       */
      static get TIME_WITH_LONG_OFFSET() {
        return TIME_WITH_LONG_OFFSET;
      }

      /**
       * {@link DateTime#toLocaleString} format like '09:30', always 24-hour.
       * @type {Object}
       */
      static get TIME_24_SIMPLE() {
        return TIME_24_SIMPLE;
      }

      /**
       * {@link DateTime#toLocaleString} format like '09:30:23', always 24-hour.
       * @type {Object}
       */
      static get TIME_24_WITH_SECONDS() {
        return TIME_24_WITH_SECONDS;
      }

      /**
       * {@link DateTime#toLocaleString} format like '09:30:23 EDT', always 24-hour.
       * @type {Object}
       */
      static get TIME_24_WITH_SHORT_OFFSET() {
        return TIME_24_WITH_SHORT_OFFSET;
      }

      /**
       * {@link DateTime#toLocaleString} format like '09:30:23 Eastern Daylight Time', always 24-hour.
       * @type {Object}
       */
      static get TIME_24_WITH_LONG_OFFSET() {
        return TIME_24_WITH_LONG_OFFSET;
      }

      /**
       * {@link DateTime#toLocaleString} format like '10/14/1983, 9:30 AM'. Only 12-hour if the locale is.
       * @type {Object}
       */
      static get DATETIME_SHORT() {
        return DATETIME_SHORT;
      }

      /**
       * {@link DateTime#toLocaleString} format like '10/14/1983, 9:30:33 AM'. Only 12-hour if the locale is.
       * @type {Object}
       */
      static get DATETIME_SHORT_WITH_SECONDS() {
        return DATETIME_SHORT_WITH_SECONDS;
      }

      /**
       * {@link DateTime#toLocaleString} format like 'Oct 14, 1983, 9:30 AM'. Only 12-hour if the locale is.
       * @type {Object}
       */
      static get DATETIME_MED() {
        return DATETIME_MED;
      }

      /**
       * {@link DateTime#toLocaleString} format like 'Oct 14, 1983, 9:30:33 AM'. Only 12-hour if the locale is.
       * @type {Object}
       */
      static get DATETIME_MED_WITH_SECONDS() {
        return DATETIME_MED_WITH_SECONDS;
      }

      /**
       * {@link DateTime#toLocaleString} format like 'Fri, 14 Oct 1983, 9:30 AM'. Only 12-hour if the locale is.
       * @type {Object}
       */
      static get DATETIME_MED_WITH_WEEKDAY() {
        return DATETIME_MED_WITH_WEEKDAY;
      }

      /**
       * {@link DateTime#toLocaleString} format like 'October 14, 1983, 9:30 AM EDT'. Only 12-hour if the locale is.
       * @type {Object}
       */
      static get DATETIME_FULL() {
        return DATETIME_FULL;
      }

      /**
       * {@link DateTime#toLocaleString} format like 'October 14, 1983, 9:30:33 AM EDT'. Only 12-hour if the locale is.
       * @type {Object}
       */
      static get DATETIME_FULL_WITH_SECONDS() {
        return DATETIME_FULL_WITH_SECONDS;
      }

      /**
       * {@link DateTime#toLocaleString} format like 'Friday, October 14, 1983, 9:30 AM Eastern Daylight Time'. Only 12-hour if the locale is.
       * @type {Object}
       */
      static get DATETIME_HUGE() {
        return DATETIME_HUGE;
      }

      /**
       * {@link DateTime#toLocaleString} format like 'Friday, October 14, 1983, 9:30:33 AM Eastern Daylight Time'. Only 12-hour if the locale is.
       * @type {Object}
       */
      static get DATETIME_HUGE_WITH_SECONDS() {
        return DATETIME_HUGE_WITH_SECONDS;
      }
    }

    /**
     * @private
     */
    function friendlyDateTime(dateTimeish) {
      if (DateTime.isDateTime(dateTimeish)) {
        return dateTimeish;
      } else if (dateTimeish && dateTimeish.valueOf && isNumber(dateTimeish.valueOf())) {
        return DateTime.fromJSDate(dateTimeish);
      } else if (dateTimeish && typeof dateTimeish === "object") {
        return DateTime.fromObject(dateTimeish);
      } else {
        throw new InvalidArgumentError(
          `Unknown datetime argument: ${dateTimeish}, of type ${typeof dateTimeish}`
        );
      }
    }

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    var hashSum;
    var hasRequiredHashSum;

    function requireHashSum () {
    	if (hasRequiredHashSum) return hashSum;
    	hasRequiredHashSum = 1;

    	function pad (hash, len) {
    	  while (hash.length < len) {
    	    hash = '0' + hash;
    	  }
    	  return hash;
    	}

    	function fold (hash, text) {
    	  var i;
    	  var chr;
    	  var len;
    	  if (text.length === 0) {
    	    return hash;
    	  }
    	  for (i = 0, len = text.length; i < len; i++) {
    	    chr = text.charCodeAt(i);
    	    hash = ((hash << 5) - hash) + chr;
    	    hash |= 0;
    	  }
    	  return hash < 0 ? hash * -2 : hash;
    	}

    	function foldObject (hash, o, seen) {
    	  return Object.keys(o).sort().reduce(foldKey, hash);
    	  function foldKey (hash, key) {
    	    return foldValue(hash, o[key], key, seen);
    	  }
    	}

    	function foldValue (input, value, key, seen) {
    	  var hash = fold(fold(fold(input, key), toString(value)), typeof value);
    	  if (value === null) {
    	    return fold(hash, 'null');
    	  }
    	  if (value === undefined) {
    	    return fold(hash, 'undefined');
    	  }
    	  if (typeof value === 'object' || typeof value === 'function') {
    	    if (seen.indexOf(value) !== -1) {
    	      return fold(hash, '[Circular]' + key);
    	    }
    	    seen.push(value);

    	    var objHash = foldObject(hash, value, seen);

    	    if (!('valueOf' in value) || typeof value.valueOf !== 'function') {
    	      return objHash;
    	    }

    	    try {
    	      return fold(objHash, String(value.valueOf()))
    	    } catch (err) {
    	      return fold(objHash, '[valueOf exception]' + (err.stack || err.message))
    	    }
    	  }
    	  return fold(hash, value.toString());
    	}

    	function toString (o) {
    	  return Object.prototype.toString.call(o);
    	}

    	function sum (o) {
    	  return pad(foldValue(0, o, '', []).toString(16), 8);
    	}

    	hashSum = sum;
    	return hashSum;
    }

    var hashSumExports = requireHashSum();
    var hash = /*@__PURE__*/getDefaultExportFromCjs(hashSumExports);

    /**
     * Takes a CSV string and parses it into our internal record format.
     *
     * @param   {string}       csvData     The CSV string
     * @param   {string}       timeZone    An optional time zone (IANA string)
     * @param   {Function}     dateParser  An optional date parser function
     * @param   {Function}     rowParser   A parser to modify the records parsed
     *                                     from the CSV, in case you have additional
     *                                     columns you want to take in.
     *
     * @return  {CSVRecord[]}              The parsed CSV records
     */
    function parseCsv(csvData, timeZone, dateParser, rowParser) {
        // Small utility function to harmonize datetime parsing
        const parseISODate = (isoDate) => {
            if (dateParser !== undefined) {
                isoDate = dateParser(isoDate, DateTime);
            }
            try {
                return DateTime.fromISO(isoDate, { zone: timeZone });
            }
            catch (err) {
                throw new Error(`Could not parse date string to ISO: ${isoDate}`);
            }
        };
        const rows = csvData
            .split(/[\n\r]+/)
            .filter(row => row.trim() !== '')
            // Remove empty rows (this happens if users space out the events in their
            // spreadsheet to group them logically.)
            .filter(row => !/^[\s,]+$/.test(row));
        if (rows.length < 2) {
            throw new Error('Invalid CSV: Less than 2 rows!');
        }
        const header = rows.shift().split(',').map(c => c.toLowerCase());
        const EXPECTED_COLS = header.length;
        const DATE_START_IDX = header.findIndex(c => c === 'date_start');
        const DATE_END_IDX = header.findIndex(c => c === 'date_end');
        const TYPE_IDX = header.findIndex(c => c === 'type');
        const TITLE_IDX = header.findIndex(c => c === 'title');
        const ABSTRACT_IDX = header.findIndex(c => c === 'abstract');
        const AUTHOR_IDX = header.findIndex(c => c === 'author');
        const LOCATION_IDX = header.findIndex(c => c === 'location');
        const SESSION_IDX = header.findIndex(c => c === 'session');
        const SESSION_ORDER_IDX = header.findIndex(c => c === 'session_order');
        const CHAIR_IDX = header.findIndex(c => c === 'chair');
        const NOTES_IDX = header.findIndex(c => c === 'notes');
        if (DATE_START_IDX < 0) {
            throw new Error('The CSV did not contain a `date_start` column.');
        }
        if (DATE_END_IDX < 0) {
            throw new Error('The CSV did not contain a `date_end` column.');
        }
        if (TYPE_IDX < 0) {
            throw new Error('The CSV did not contain a `type` column.');
        }
        if (TITLE_IDX < 0) {
            throw new Error('The CSV did not contain a `title` column.');
        }
        if (ABSTRACT_IDX < 0) {
            throw new Error('The CSV did not contain a `abstract` column.');
        }
        if (AUTHOR_IDX < 0) {
            throw new Error('The CSV did not contain a `author` column.');
        }
        if (LOCATION_IDX < 0) {
            throw new Error('The CSV did not contain a `location` column.');
        }
        if (SESSION_IDX < 0) {
            throw new Error('The CSV did not contain a `session` column.');
        }
        if (SESSION_ORDER_IDX < 0) {
            throw new Error('The CSV did not contain a `session_order` column.');
        }
        if (CHAIR_IDX < 0) {
            throw new Error('The CSV did not contain a `chair` column.');
        }
        const returnValue = [];
        const onlySessionPresentations = [];
        for (const row of rows.map(row => parseCSVLine(row))) {
            if (row.length !== EXPECTED_COLS) {
                throw new Error(`Wrong number of columns in row (${row.length}; expected ${EXPECTED_COLS}) in row: ${row.join(',')}`);
            }
            const start = parseISODate(row[DATE_START_IDX]);
            const end = parseISODate(row[DATE_END_IDX]);
            const type = row[TYPE_IDX];
            const title = row[TITLE_IDX];
            const abstract = row[ABSTRACT_IDX];
            const author = row[AUTHOR_IDX];
            const location = row[LOCATION_IDX];
            const session = row[SESSION_IDX];
            const sessionOrder = row[SESSION_ORDER_IDX];
            const chair = row[CHAIR_IDX];
            const notes = NOTES_IDX > -1 ? row[NOTES_IDX] : undefined;
            const id = hash(String(start) + String(end) + type + title);
            switch (type) {
                case 'session_presentation': {
                    // NOTE that we place session presentations in a different array to
                    // simplify the interface the rest of the library has to work with.
                    const record = {
                        type: 'session_presentation',
                        dateStart: start,
                        dateEnd: end,
                        title, abstract, author, location, session, chair, notes, id,
                        sessionOrder: parseInt(sessionOrder, 10)
                    };
                    onlySessionPresentations.push(rowParser ? rowParser(row, header, record) : record);
                    break;
                }
                case 'keynote': {
                    const record = {
                        type: 'keynote',
                        dateStart: start,
                        dateEnd: end,
                        title, abstract, author, location, chair, notes, id
                    };
                    returnValue.push(rowParser ? rowParser(row, header, record) : record);
                    break;
                }
                case 'meta': {
                    const record = {
                        type: 'meta',
                        dateStart: start,
                        dateEnd: end,
                        title, location, notes, id
                    };
                    returnValue.push(rowParser ? rowParser(row, header, record) : record);
                    break;
                }
                case 'single': {
                    const record = {
                        type: 'single',
                        dateStart: start,
                        dateEnd: end,
                        title, location, abstract, author, chair, notes, id
                    };
                    returnValue.push(rowParser ? rowParser(row, header, record) : record);
                    break;
                }
                case 'special': {
                    const record = {
                        type: 'special',
                        dateStart: start,
                        dateEnd: end,
                        title, location, abstract, author, chair, notes, id
                    };
                    returnValue.push(rowParser ? rowParser(row, header, record) : record);
                    break;
                }
                default:
                    console.warn(`Unknown type detected in entry: ${type}. Skipping row.`);
            }
        }
        // One final step: Aggregate the various presentations according to sessionName.
        const sessionNames = [...new Set(onlySessionPresentations.map(s => s.session))];
        for (const name of sessionNames) {
            const presentations = onlySessionPresentations.filter(r => r.session === name);
            const { dateStart, dateEnd, location, chair, notes } = presentations[0];
            // Sort the presentations according to their ordering
            presentations.sort((a, b) => a.sessionOrder - b.sessionOrder);
            // Use just the date and session name to identify sessions. This way,
            // presentations can change without removing the session itself from any
            // users' agenda.
            const id = hash(String(dateStart) + String(dateEnd) + 'session' + name);
            returnValue.push({
                type: 'session', title: name,
                dateStart, dateEnd, location, presentations, chair, notes, id
            });
        }
        // Sort the events by time
        returnValue.sort((a, b) => {
            return a.dateStart.diff(b.dateStart, 'seconds').as('seconds');
        });
        return returnValue;
    }
    /**
     * Takes a CSV line and parses it into a series of cells.
     *
     * @param   {string}    line  The line to parse
     *
     * @return  {string[]}        The cells
     */
    function parseCSVLine(line, sep = ',') {
        const cells = [];
        let currentCell = '';
        let isQuoted = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            // We have to deal with two special character cases
            if (char === sep) {
                // Cell Separator
                if (isQuoted) {
                    currentCell += char;
                }
                else {
                    cells.push(currentCell);
                    currentCell = '';
                    isQuoted = false;
                }
            }
            else if (char === '"') {
                // Quote
                if (currentCell === '') {
                    // Current Cell is empty -> Marks beginning of a quoted cell
                    isQuoted = true;
                }
                else if (isQuoted) {
                    // Double quote within a quoted cell either marks the end or an escaped
                    // double quote. Is determined by the next character. If it's a quote,
                    // we shall add a quote to the cell contents, otherwise the cell is
                    // done.
                    const nextChar = line[i + 1];
                    if (nextChar === '"') {
                        currentCell += char; // It's an escaped quote.
                        i++; // Jump over the next quote
                    }
                    else if (nextChar === sep) {
                        // Not an escaped quote -> end of cell
                        isQuoted = false;
                    }
                    else {
                        // Malformed cell
                        throw new Error('Could not parse CSV line: Malformed cell: ' + line);
                    }
                }
                else {
                    // Malformed cell
                    throw new Error('Could not parse CSV line: Malformed cell: ' + line);
                }
            }
            else {
                // Everything else
                currentCell += char;
            }
        }
        cells.push(currentCell); // Final cell is not delimited with `sep`
        return cells;
    }

    /**
     * Given an array of dates, returns the date that has the earliest time of day.
     *
     * @param   {DateTime[]}  dates  A list of dates
     *
     * @return  {DateTime}           The date with the earliest time of day
     */
    function getEarliestTime(dates) {
        if (dates.length === 0) {
            return undefined;
        }
        return dates.sort((a, b) => {
            if (a.hour !== b.hour) {
                return a.hour - b.hour;
            }
            else if (a.minute !== b.minute) {
                return a.minute - b.minute;
            }
            else if (a.second !== b.second) {
                return a.second - b.second;
            }
            else {
                return 0;
            }
        })[0];
    }
    /**
     * Given an array of dates, returns the date that has the latest time of day.
     *
     * @param   {DateTime[]}  dates  A list of dates
     *
     * @return  {DateTime}           The date with the latest time of day
     */
    function getLatestTime(dates) {
        if (dates.length === 0) {
            return undefined;
        }
        return dates.sort((a, b) => {
            if (a.hour !== b.hour) {
                return a.hour - b.hour;
            }
            else if (a.minute !== b.minute) {
                return a.minute - b.minute;
            }
            else if (a.second !== b.second) {
                return a.second - b.second;
            }
            else {
                return 0;
            }
        }).reverse()[0];
    }
    /**
     * Given a list of dates, returns the DateTime that is the earliest one.
     *
     * @param   {DateTime[]}  dates  A list of dates
     *
     * @return  {DateTime}           The earliest date
     */
    function getEarliestDay(dates) {
        return DateTime.min(...dates);
    }
    /**
     * Given a list of dates, returns the DateTime that is the latest one.
     *
     * @param   {DateTime[]}  dates  A list of dates
     *
     * @return  {DateTime}           The latest date
     */
    function getLatestDay(dates) {
        return DateTime.max(...dates);
    }
    /**
     * Given a list of startDate/endDate tuples, returns the shortest interval
     * between those two in seconds.
     *
     * @param   {Array<[DateTime, DateTime]>}  events  A list of tuples of start and end Dates
     *
     * @return  {number}                       The shortest interval in the array, in seconds.
     */
    function getShortestInterval(events) {
        const durations = events
            .map(([start, end]) => end.diff(start))
            .map(d => d.as('seconds'));
        durations.sort((a, b) => a - b);
        return durations[0];
    }
    /**
     * Returns the time offset between time and referenceTime in seconds. This
     * function only looks at the actual times within the dates, ignoring both
     * timezones and dates.
     *
     * @param   {DateTime}  time           The time in question
     * @param   {DateTime}  referenceTime  The reference (earliest) time
     *
     * @return  {number}                   The difference in seconds.
     */
    function getTimeOffset(time, referenceTime) {
        // Normalize times. Since Luxon isn't able to do just operations on the time
        // alone (at least not that I've found it), we need to strip every piece of
        // information from the dates, and instead make Luxon recreate a DateTime, but
        // only with diffs in hh:mm:ss.
        time = DateTime.fromObject({ hour: time.hour, minute: time.minute, second: time.second });
        referenceTime = DateTime.fromObject({ hour: referenceTime.hour, minute: referenceTime.minute, second: referenceTime.second });
        return time.diff(referenceTime).as('seconds');
    }
    /**
     * Returns the duration between referenceDate and date in number of days.
     *
     * @param   {DateTime}  date           The date in question
     * @param   {DateTime}  referenceDate  The reference (earliest) date
     *
     * @return  {number}                   The number of days between the dates.
     */
    function getDayOffset(date, referenceDate) {
        date = date.startOf('day');
        referenceDate = referenceDate.startOf('day');
        return date.diff(referenceDate).as('days');
    }

    /**
     * Utility function that allows creation of DOM elements in a more ergonomic way
     * than the default document.createElement way.
     *
     * @param   {HTMLElementTagNameMap}  tagName  The tag name
     * @param   {string[][]}             classes  Optional classes to add
     * @param   {Record<string, string>} attr     Attributes to set
     *
     * @return  {HTMLElement}                     The HTML Element
     */
    function dom(tagName, classes, attr) {
        const elem = document.createElement(tagName);
        if (typeof classes === 'string') {
            elem.classList.value = classes;
        }
        else if (Array.isArray(classes)) {
            elem.classList.add(...classes);
        }
        if (attr !== undefined) {
            for (const prop in attr) {
                elem.setAttribute(prop, attr[prop]);
            }
        }
        return elem;
    }

    const MINIMUM_TICK_HEIGHT = 25;
    function generateTimeGutter() {
        return dom('div', undefined, { id: 'conferia-time-gutter', role: 'presentation' });
    }
    /**
     * Updates the time gutter to reflect the full range of times
     *
     * @param   {HTMLElement}  timeGutter  The time gutter DOM element
     * @param   {DateTime}     startTime   The earliest time available
     * @param   {DateTime}     endTime     The latest time available
     * @param   {number}       pps         Pixels per second (of height)
     * @param   {number}       interval    Suggested interval in seconds (default:
     *                                     5min/300sec). The library will increase
     *                                     this in 5 minute steps if the ticks would
     *                                     be too small. Minimum is 5 minutes.
     */
    function updateGutterTicks$1(timeGutter, startTime, endTime, pps, interval = 300) {
        const secondsPerDay = getTimeOffset(endTime, startTime);
        // NOTE: Ticks should increase or decrease by intervals of 300 seconds (5 minutes)
        let tickSize = Math.max(300, interval);
        while (tickSize * pps < MINIMUM_TICK_HEIGHT) {
            tickSize += 300;
        }
        const tickCount = Math.ceil(secondsPerDay / tickSize);
        // Update the time Gutter accordingly. First, the height. Then, the ticks.
        timeGutter.innerHTML = '';
        // One tick per shortest interval
        timeGutter.style = `height: ${(tickCount + 1) * tickSize * pps}px;`;
        for (let i = 0; i <= tickCount; i++) {
            const tick = dom('div', 'tick time', { role: 'presentation' });
            tick.style = `height: ${tickSize * pps}px;`;
            const tickTime = startTime.plus({ seconds: i * tickSize });
            tick.textContent = tickTime.toLocaleString({ timeStyle: 'short', hourCycle: 'h24' });
            timeGutter.appendChild(tick);
        }
    }

    function generateDayGutter() {
        return dom('div', undefined, { id: 'conferia-day-gutter', role: 'presentation' });
    }
    function updateGutterTicks(dayGutter, startDay, totalDays, colWidth, dayLocations) {
        dayGutter.innerHTML = '';
        for (let i = 0; i < totalDays; i++) {
            // Ensure we have at least one column. dayLocations.length may be 0 if on a
            // day there are only no-location events.
            const nSubCols = dayLocations !== undefined ? Math.max(1, dayLocations[i].length) : 1;
            const thisDay = startDay.plus({ days: i });
            const dayTick = dom('div', 'tick day', { role: 'presentation' });
            dayTick.textContent = thisDay.toLocaleString({ weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
            dayTick.style.width = `${colWidth * nSubCols}px`;
            dayGutter.appendChild(dayTick);
        }
    }

    var bookmarkIcon = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-bookmark\"><path d=\"M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z\"></path></svg>";

    function getAriaEventType(event) {
        if (event.type === 'keynote') {
            return 'Keynote';
        }
        else if (event.type === 'session') {
            return 'Parallel Session';
        }
        else if (event.type === 'special') {
            return 'Special Event';
        }
        else {
            return 'Event';
        }
    }
    /**
     * Generates the schedule board wrapper
     *
     * @return  {HTMLDivElement}  The wrapper DIV
     */
    function generateScheduleWrapper() {
        return dom('div', undefined, { id: 'conferia-schedule-wrapper', role: 'presentation' });
    }
    function generateScheduleBoard() {
        return dom('div', undefined, {
            id: 'conferia-schedule-board',
            role: 'region',
            'aria-label': 'Agenda'
        });
    }
    function updateScheduleBoard(scheduleBoard, dayWidth, timeWidth) {
        scheduleBoard.style = `background-size: ${dayWidth}px ${timeWidth}px;
    background-image:
    repeating-linear-gradient(90deg, transparent, transparent ${dayWidth - 1}px, var(--schedule-board-grid) ${dayWidth - 1}px, var(--schedule-board-grid) ${dayWidth}px),
    repeating-linear-gradient(0deg, transparent, transparent ${timeWidth - 1}px, var(--schedule-board-grid) ${timeWidth - 1}px, var(--schedule-board-grid) ${timeWidth}px);`;
    }
    function drawVerticalDayDividers(startTime, endTime, scheduleBoard, columnWidth, colsPerDay, pps) {
        const secondsPerDay = getTimeOffset(endTime, startTime);
        const dividerHeight = secondsPerDay * pps;
        const dividerWidth = 6;
        for (let day = 1; day < colsPerDay.length; day++) {
            const prevColumnsOffset = colsPerDay.slice(0, day).reduce((prev, cur) => prev + Math.max(cur.length, 1), 0);
            const div = dom('div', 'cf-day-divider');
            div.style.width = `${dividerWidth}px`;
            div.style.height = `${dividerHeight}px`;
            div.style.top = '0px';
            div.style.left = `${prevColumnsOffset * columnWidth - dividerWidth / 2}px`;
            scheduleBoard.appendChild(div);
        }
    }
    function generateEventCard(event, agenda) {
        const card = dom('div', ['event', event.type], {
            tabindex: '0',
            role: 'button',
            'aria-label': `${getAriaEventType(event)}: ${event.title}; ${event.dateStart.toLocaleString({ dateStyle: 'full', timeStyle: 'short' })} in ${event.location === '' ? 'No location' : event.location}`
        });
        card.style.position = 'absolute';
        // Card header
        // ==========================================
        const header = dom('div', 'event-header');
        card.appendChild(header);
        const title = dom('h3', 'cf-event-title', { id: `title-${event.id}` });
        title.textContent = event.title;
        header.appendChild(title);
        if (event.location !== undefined) {
            const loc = dom('p', 'location');
            loc.textContent = event.location;
            header.appendChild(loc);
        }
        // Card content
        // ==========================================
        const content = dom('div', 'event-content');
        card.appendChild(content);
        if (event.type === 'session') {
            const ol = dom('ol', 'presentation-list');
            for (const presentation of event.presentations) {
                const li = dom('li');
                li.textContent = presentation.title;
                ol.appendChild(li);
            }
            content.appendChild(ol);
        }
        else if (event.type === 'keynote' || event.type === 'single') {
            const author = dom('p', 'author');
            author.textContent = event.author;
            content.appendChild(author);
        }
        // Card footer
        // ==========================================
        const footer = dom('div', 'event-footer');
        card.appendChild(footer);
        // Footer information
        const idElem = dom('p', 'event-id');
        idElem.textContent = event.id;
        footer.appendChild(idElem);
        const bookmarkItem = dom('div', 'bookmark');
        bookmarkItem.innerHTML = bookmarkIcon;
        card.classList.toggle('bookmarked', agenda.hasItem(event.id));
        bookmarkItem.addEventListener('click', evt => {
            evt.preventDefault();
            evt.stopPropagation();
            if (agenda.hasItem(event.id)) {
                agenda.removeItem(event.id);
            }
            else {
                agenda.addItem(event.id);
            }
            card.classList.toggle('bookmarked', agenda.hasItem(event.id));
        });
        footer.appendChild(bookmarkItem);
        return card;
    }

    var slashIcon = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-slash\"><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"4.93\" y1=\"4.93\" x2=\"19.07\" y2=\"19.07\"></line></svg>";

    var helpIcon = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-help-circle\"><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3\"></path><line x1=\"12\" y1=\"17\" x2=\"12.01\" y2=\"17\"></line></svg>";

    var calendarIcon = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-calendar\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect><line x1=\"16\" y1=\"2\" x2=\"16\" y2=\"6\"></line><line x1=\"8\" y1=\"2\" x2=\"8\" y2=\"6\"></line><line x1=\"3\" y1=\"10\" x2=\"21\" y2=\"10\"></line></svg>";

    // Utility to ask the user using a dialog
    /**
     * Shows a dialog to the user asking to click one of the buttons. The promise
     * resolves with either the clicked button ID, or undefined if the dialog was
     * closed without clicking a button.
     *
     * @param   {string}                     title    The dialog title
     * @param   {string}                     message  The dialog message
     * @param   {string[]}                   buttons  The button labels
     *
     * @return  {Promise<number|undefined>}           The button ID, or undefined
     */
    function askUser(title, message, buttons) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const dialog = dom('dialog', 'conferia-dialog');
                const titleElem = dom('h3', 'title');
                titleElem.textContent = title;
                dialog.appendChild(titleElem);
                const content = dom('div');
                content.textContent = message;
                dialog.appendChild(content);
                const buttonGroup = dom('div', 'button-group');
                dialog.appendChild(buttonGroup);
                for (let i = 0; i < buttons.length; i++) {
                    const buttonElement = document.createElement('button');
                    buttonElement.textContent = buttons[i];
                    buttonElement.addEventListener('click', () => {
                        resolve(i);
                        dialog.close();
                    });
                    buttonGroup.appendChild(buttonElement);
                }
                document.body.appendChild(dialog);
                dialog.addEventListener('close', () => {
                    resolve(undefined);
                    document.body.removeChild(dialog);
                });
                dialog.showModal();
            });
        });
    }

    // Toolbar related DOM structure generation
    function generateToolbarStructure() {
        const toolbar = dom('div', undefined, { id: 'conferia-toolbar' });
        const filter = dom('input', undefined, { type: 'search', placeholder: 'Search…' });
        toolbar.appendChild(filter);
        const agendaLabel = dom('label');
        const personalAgendaToggle = dom('input', undefined, { type: 'checkbox' });
        agendaLabel.appendChild(personalAgendaToggle);
        agendaLabel.appendChild(new Text('Only Personal Agenda'));
        toolbar.appendChild(agendaLabel);
        const toIcalButton = dom('button', undefined, { title: 'Add to calendar' });
        toIcalButton.innerHTML = calendarIcon;
        toolbar.appendChild(toIcalButton);
        const fullscreenButton = dom('button');
        toolbar.appendChild(fullscreenButton);
        const clearButton = dom('button', undefined, { title: 'Clear data…' });
        clearButton.innerHTML = slashIcon;
        toolbar.appendChild(clearButton);
        const helpButton = dom('button', undefined, { title: 'Help' });
        helpButton.innerHTML = helpIcon;
        toolbar.appendChild(helpButton);
        // We can handle the help button directly here.
        helpButton.addEventListener('click', () => {
            askUser('About Conferia.js', `This conference utilizes the Free and Open Source framework Conferia.js to implement an interactive agenda. Conferia allows you to browse the program effortlessly, search for events, and even bookmark sessions and export them into your personal calendar. Conferia.js has a manual that explains its features and how to use them.`, [
                'Open documentation',
                'Close'
            ]).then(response => {
                if (response === 0) {
                    // User wants to open the documentation -> redirect them to the documentation.
                    // NOTE: We have to do this little anchor element programmatic click dance
                    // because Safari on iOS again does not allow opening a new tab using window.open.
                    const a = dom('a', undefined, { href: 'https://nathanlesage.github.io/conferia/users-guide/', target: '_blank' });
                    document.body.appendChild(a);
                    a.addEventListener('mouseup', event => {
                        document.body.removeChild(a);
                    });
                    a.click();
                }
            });
        });
        return {
            toolbar,
            filter, personalAgendaToggle,
            toIcalButton, fullscreenButton, clearButton
        };
    }

    var version = "0.18.0";
    var pkg = {
    	version: version};

    var enterFullscreenIcon = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-maximize\"><path d=\"M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3\"></path></svg>";

    var exitFullscreenIcon = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-minimize\"><path d=\"M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3\"></path></svg>";

    /**
     * Generates the primary Conferia.js DOM structure.
     *
     * @param   {string}        title      The optional title
     * @param   {string}        maxHeight  An optional max height string (e.g., `100vh`)
     *
     * @return  {DOMStructure}             The DOM structure
     */
    function generateDOMStructure(title, maxHeight) {
        const wrapper = generateWrapper(title);
        const dayGutter = generateDayGutter();
        const timeGutter = generateTimeGutter();
        const scheduleWrapper = generateScheduleWrapper();
        const scheduleBoard = generateScheduleBoard();
        const { toolbar, filter, personalAgendaToggle, toIcalButton, fullscreenButton, clearButton } = generateToolbarStructure();
        wrapper.appendChild(toolbar);
        scheduleWrapper.appendChild(dayGutter);
        scheduleWrapper.appendChild(timeGutter);
        scheduleWrapper.appendChild(scheduleBoard);
        wrapper.appendChild(scheduleWrapper);
        const footer = generateFooter();
        wrapper.appendChild(footer);
        // Hook shortcuts
        document.addEventListener('keydown', event => {
            const cmdOrCtrl = event.metaKey || event.ctrlKey;
            if (cmdOrCtrl && event.key === 'f') {
                event.preventDefault();
                event.stopPropagation();
                filter.focus();
            }
        });
        // Initial state preset for the fullscreen button
        fullscreenButton.innerHTML = enterFullscreenIcon;
        fullscreenButton.title = 'Enter Fullscreen';
        fullscreenButton.addEventListener('click', event => {
            if (wrapper.classList.contains('fullscreen')) {
                wrapper.classList.remove('fullscreen');
                fullscreenButton.innerHTML = enterFullscreenIcon;
                fullscreenButton.title = 'Enter Fullscreen';
            }
            else {
                wrapper.classList.add('fullscreen');
                fullscreenButton.innerHTML = exitFullscreenIcon;
                fullscreenButton.title = 'Exit Fullscreen';
            }
        });
        return {
            wrapper, timeGutter, dayGutter, scheduleBoard,
            filter, personalAgendaToggle, toIcalButton, clearButton
        };
    }
    /**
     * Generates the outer wrapper
     *
     * @param   {string}          title      The optional title
     * @param   {string}          maxHeight  The optional max Height property
     *
     * @return  {HTMLDivElement}             The wrapper DIV
     */
    function generateWrapper(title, maxHeight) {
        const div = dom('div', undefined, { id: 'conferia-wrapper', role: 'presentation' });
        if (title !== undefined) {
            const h1 = dom('h1');
            h1.textContent = title;
            div.appendChild(h1);
        }
        return div;
    }
    /**
     * Generates the Conferia.js footer
     *
     * @return  {HTMLDivElement}  The footer DIV
     */
    function generateFooter() {
        const div = dom('div', undefined, { id: 'conferia-footer' });
        const copy = dom('span');
        copy.innerHTML = `Powered by <a href="https://nathanlesage.github.io/conferia/" target="_blank">Conferia.js</a> | &copy; 2025 | <a href="https://nathanlesage.github.io/conferia/users-guide" target="_blank">User‘s Guide</a>`;
        div.appendChild(copy);
        const ver = dom('span', undefined, { id: 'cf-version' });
        ver.textContent = 'v' + pkg.version;
        div.appendChild(ver);
        return div;
    }

    /**
     * Creates and shows a dialog showing details for the provided event.
     *
     * @param   {CSVRecord}  event  The event to detail
     */
    function showEventDetailsModal(event, conferia) {
        var _a;
        const dialog = dom('dialog', 'conferia-dialog conferia-event-details', {
            'aria-labelledby': `dialog-title-${event.id}`,
            'aria-details': `dialog-content-${event.id}`
        });
        const title = dom('h3', 'cf-event-title', {
            id: `dialog-title-${event.id}`,
            'aria-label': `Details for event: ${event.title}, ${event.dateStart.toLocaleString({ dateStyle: 'full', timeStyle: 'short' })}, location: ${(_a = event.location) !== null && _a !== void 0 ? _a : 'No location'}`
        });
        switch (event.type) {
            case 'keynote':
                title.textContent = 'Keynote: ' + event.title;
                break;
            case 'session':
                title.textContent = 'Session: ' + event.title;
                break;
            default:
                title.textContent = event.title;
        }
        dialog.appendChild(title);
        if (event.location !== undefined) {
            const loc = dom('p', 'location');
            loc.textContent = event.location;
            dialog.appendChild(loc);
        }
        const content = generateEventDOMStructure(event);
        content.setAttribute('id', `dialog-content-${event.id}`);
        dialog.appendChild(content);
        const idElem = dom('p', 'event-id');
        idElem.textContent = event.id;
        dialog.appendChild(idElem);
        // Bookmarking Capabilities
        const bookmarkButton = dom('div', 'bookmark', { tabindex: '0', role: 'button', title: 'Bookmark this event' });
        if (conferia.agenda.hasItem(event.id)) {
            bookmarkButton.classList.add('bookmarked');
        }
        bookmarkButton.innerHTML = bookmarkIcon;
        dialog.appendChild(bookmarkButton);
        bookmarkButton.addEventListener('click', () => {
            if (conferia.agenda.hasItem(event.id)) {
                conferia.agenda.removeItem(event.id);
                bookmarkButton.classList.remove('bookmarked');
            }
            else {
                conferia.agenda.addItem(event.id);
                bookmarkButton.classList.add('bookmarked');
            }
            conferia.updateUI();
        });
        // End Bookmarking
        // Dialog closing
        const closeButton = dom('button', 'close-button');
        closeButton.textContent = 'Close';
        closeButton.addEventListener('click', () => dialog.close());
        dialog.appendChild(closeButton);
        const closeDialog = (event) => {
            if (event instanceof MouseEvent) {
                const { top, right, bottom, left } = dialog.getBoundingClientRect();
                if (event.clientX >= left && event.clientX <= right &&
                    event.clientY >= top && event.clientY <= bottom) {
                    return; // Do not close dialog
                }
            }
            document.body.removeChild(dialog);
            document.removeEventListener('mouseup', closeDialog);
        };
        document.body.appendChild(dialog);
        dialog.addEventListener('close', closeDialog);
        document.addEventListener('mouseup', closeDialog);
        dialog.showModal();
    }
    /**
     * Generates a content DOM structure for use in dialogs for events
     *
     * @param   {CSVRecord}  event  The event to detail
     *
     * @return  {HTMLElement}            The content DOM
     */
    function generateEventDOMStructure(event) {
        const wrapper = generateDialogWrapper();
        const time = dom('p', 'time');
        wrapper.appendChild(time);
        const date = event.dateStart.toLocaleString({ dateStyle: 'medium' });
        const fromString = event.dateStart.toLocaleString({ timeStyle: 'short' });
        const toString = event.dateEnd.toLocaleString({ timeStyle: 'short' });
        time.textContent = `${date}, ${fromString} – ${toString}`;
        if (event.chair !== undefined && event.chair !== '') {
            const chair = dom('p', 'chair', { tabindex: '0' });
            chair.textContent = 'Chair: ' + event.chair;
            wrapper.appendChild(chair);
        }
        if (event.notes !== undefined && event.notes !== '') {
            const notes = dom('p', 'notes');
            notes.textContent = 'Notes: ' + event.notes;
            wrapper.appendChild(notes);
        }
        if (event.type === 'session') {
            wrapper.appendChild(dom('hr')); // Add a divider
            const ol = dom('ol', 'presentation-list');
            for (const pres of event.presentations) {
                const details = dom('details', 'presentation', {
                    'aria-labelledby': `dialog-title-${pres.id}`,
                    'aria-details': `dialog-abstract-${pres.id}`
                });
                const summary = dom('summary', undefined, { 'aria-label': 'Presentation: ' + pres.title, id: `dialog-title-${pres.id}` });
                details.appendChild(summary);
                const title = dom('strong', 'presentation-title');
                title.textContent = pres.title;
                summary.appendChild(title);
                const author = dom('p', 'author', { 'aria-label': `Author: ${pres.author}` });
                author.textContent = pres.author;
                summary.appendChild(author);
                const toggle = dom('span', 'abstract-toggle', { role: 'presentation' });
                summary.appendChild(toggle);
                const abstract = dom('p', 'abstract', {
                    id: `dialog-abstract-${pres.id}`, tabindex: '0',
                    'aria-label': 'Abstract: ' + pres.abstract
                });
                abstract.textContent = pres.abstract;
                details.appendChild(abstract);
                const li = dom('li');
                li.appendChild(details);
                li.appendChild(dom('hr'));
                ol.appendChild(li);
            }
            wrapper.appendChild(ol);
        }
        if (event.type === 'keynote' || event.type === 'single' || event.type === 'special') {
            const author = dom('p', 'author', { 'aria-label': 'Author: ' + event.author, tabindex: '0' });
            author.textContent = event.author;
            wrapper.appendChild(author);
            const abstract = dom('p', 'abstract', { 'aria-label': 'Abstract: ' + event.abstract, tabindex: '0' });
            abstract.textContent = event.abstract;
            wrapper.appendChild(abstract);
        }
        return wrapper;
    }
    /**
     * Generates a wrapper for a dialog.
     *
     * @return  {HTMLElement}  The content div
     */
    function generateDialogWrapper() {
        return dom('div', 'dialog-content-wrapper');
    }

    const AGENDA_ITEM_KEY = 'conferia-agenda';
    function showIntroForUser() {
        const introText = `You have added your first element to your personal agenda.
Your personal agenda allows you to bookmark or star various events and view only
those elements, allowing you to quickly see where you need to go next. Your
bookmarks are persisted on your device into what is called "local storage." This
means that your bookmarked events will be remembered even when you close this
tab. However, the events are only stored on your device, meaning if you open
this agenda on a different device, it won't remember them. You can export and
import your agenda to transfer it between devices.`;
        askUser('Your Personalized Agenda', introText, ['Ok']);
    }
    class Agenda {
        constructor() {
            this.hasShownIntro = false;
            this.itemIDs = [];
            const agenda = window.localStorage.getItem(AGENDA_ITEM_KEY);
            if (agenda !== null && agenda.trim() !== '') {
                const parsed = JSON.parse(agenda);
                this.itemIDs = parsed.itemIDs;
                this.hasShownIntro = parsed.hasShownIntro;
            }
            this.persistToStorage(); // If the item wasn't set yet
        }
        addItem(id) {
            if (!this.hasShownIntro) {
                showIntroForUser();
                this.hasShownIntro = true;
                this.persistToStorage();
            }
            if (!this.itemIDs.includes(id)) {
                this.itemIDs.push(id);
                this.persistToStorage();
            }
        }
        removeItem(id) {
            if (this.itemIDs.includes(id)) {
                this.itemIDs.splice(this.itemIDs.indexOf(id), 1);
                this.persistToStorage();
            }
        }
        clearPersonalAgenda() {
            askUser('Clear Personal Agenda?', 'This action will reset your entire personal agenda. This is an irreversable action. Proceed?', ['Yes, clear personal agenda', 'Cancel']).then(response => {
                if (response === 0) {
                    // Clear agenda
                    this.itemIDs = [];
                    this.persistToStorage();
                }
            });
        }
        resetHasShown() {
            this.hasShownIntro = false;
            this.persistToStorage();
        }
        hasItem(id) {
            return this.itemIDs.includes(id);
        }
        getItems() {
            return this.itemIDs;
        }
        // TODO: Implement import/export
        /**
         * Persists the current state of the agenda to storage.
         */
        persistToStorage() {
            const toStore = {
                itemIDs: this.itemIDs,
                hasShownIntro: this.hasShownIntro
            };
            window.localStorage.setItem(AGENDA_ITEM_KEY, JSON.stringify(toStore));
        }
    }

    const EOL = "\r\n"; // iCal requires CRLF
    function initiateIcalDownload(conferia) {
        askUser('Add events to your calendar', `Click one of the buttons below to download a set of this program's events
in the iCal format. This will download an iCal file which you can add to your
calendar. This allows you to, e.g., quickly transfer your personal agenda to
your own calendar so that it synchronizes with all your devices.

"All events" will include every event part of the conference (not recommended).
"Visible events" will include only the currently visible events (i.e.,
respecting your filters).
"Personal agenda" will download all events that you have added to your personal
agenda.`, [
            'Download all events',
            'Download visible events',
            'Download your personal agenda',
            'Cancel'
        ]).then(buttonID => {
            if (buttonID === undefined || buttonID === 3) {
                return; // No button or cancel clicked
            }
            if (buttonID === 0) {
                const ical = recordsToIcal(conferia.getRecords());
                downloadIcal(ical);
            }
            else if (buttonID === 1) {
                const ical = recordsToIcal(conferia.getVisibleRecords());
                downloadIcal(ical);
            }
            else if (buttonID === 2) {
                const ical = recordsToIcal(conferia.getUserAgendaRecords());
                downloadIcal(ical);
            }
        });
    }
    /**
     * Downloads iCal data to the user's computer.
     *
     * @param   {string}  ical  The iCal string data
     */
    function downloadIcal(ical) {
        const file = new File([ical], 'calendar.ics', { type: 'text/calendar' });
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = URL.createObjectURL(file);
        a.download = file.name;
        document.body.appendChild(a);
        a.addEventListener('mouseup', () => {
            var _a;
            URL.revokeObjectURL(a.href);
            (_a = a.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(a);
        });
        a.click();
    }
    /**
     * Do violence to ISO 8601 datetimes
     *
     * @param   {DateTime}  date  The datetime
     *
     * @return  {string}          The iCal ISO 8601 format variant
     */
    function dt2rfc2445(date) {
        return date.setZone('utc').toFormat("yyyyLLdd'T'HHmmss'Z'");
    }
    /**
     * Turns a list of CSV records into an iCal calendar conformant to RFC 2445
     * (see https://www.ietf.org/rfc/rfc2445.txt, p. 52ff).
     * See https://datatracker.ietf.org/doc/html/rfc5545 for a newer edition.
     *
     * @param   {CSVRecord[]}  records  The records
     *
     * @return  {string}             The iCal string.
     */
    function recordsToIcal(records) {
        const icalLines = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Hendrik Erz//NONSGML Conferia.js//EN', // cf. RFC 2445, p. 74
            'CALSCALE:GREGORIAN'
        ];
        for (const rec of records) {
            icalLines.push(...recordToIcal(rec));
        }
        icalLines.push('END:VCALENDAR', EOL); // End with a CRLF
        return icalLines.join(EOL);
    }
    /**
     * Turns a CSV record into an iCal entry conformant to RFC 2445
     * (see https://www.ietf.org/rfc/rfc2445.txt, p. 52ff). NOTE that you need to
     * wrap this into a calendar
     *
     * @param   {CSVRecord}  record  The record
     *
     * @return  {string}             The iCal strings (need to be joined with EOL).
     */
    function recordToIcal(record) {
        // NOTE: DateTimes MUST be in UTC (also spares us from having to define weird
        // VTIMEZONE components).
        const dtNow = dt2rfc2445(DateTime.now());
        return [
            'BEGIN:VEVENT',
            // Start and end
            `DTSTART:${dt2rfc2445(record.dateStart)}`,
            `DTEND:${dt2rfc2445(record.dateEnd)}`,
            `LOCATION:${record.location}`,
            // iCal requires DTSTAMP
            `DTSTAMP:${dtNow}`,
            ...foldIcalLines(`SUMMARY:${record.title}`), // Summary = title
            ...icalDescriptionForRecord(record),
            `UID:${record.id}`,
            'END:VEVENT'
        ];
    }
    /**
     * Generates a valid `DESCRIPTION:` component for a `VEVENT` entry. Takes care
     * of line folding.
     *
     * @param   {CSVRecord[]}  record  The record in question.
     *
     * @return  {string[]}             The (properly parsed) lines of the DESCRIPTION.
     */
    function icalDescriptionForRecord(record) {
        // We have three possibilities:
        // * Sessions need to contain a list of presentation titles
        // * If the record has an abstract, use that one
        // * If it doesn't, return the empty string
        // NOTE: We do not add an EOL feed here, as this will be added by the compiler.
        // However, we do remove any carriage returns in the text to ensure that we
        // only have them where actually allowed.
        if (record.type === 'session') {
            // DESCRIPTION can contain the literal "\n" to denote newlines. Note that it
            // must contain those characters LITERALLY. Otherwise the validator is going
            // to complain. (See RFC 2445, p. 80 f.) Do not ask me who came up with this
            // convention.
            const description = 'DESCRIPTION:Presentations:\\n\\n' + record.presentations.map((pres, idx) => `${idx + 1}.\t` + pres.title.replace('\r', '')).join('\\n\\n');
            return foldIcalLines(description);
        }
        else if ('abstract' in record) {
            const description = 'DESCRIPTION:' + record.abstract.replace('\r', '');
            return foldIcalLines(description);
        }
        else {
            return ['DESCRIPTION:']; // Just return the empty description string
        }
    }
    /**
     * Implements RFC 2445 line folding consistent for iCalendar files.
     *
     * @param   {string}    text  The input text
     *
     * @return  {string[]}        Properly folded lines.
     */
    function foldIcalLines(text) {
        // iCal descriptions should use what RFC 2445 calls a "line folding"
        // technique. To quote:
        // "Lines of text SHOULD NOT be longer than 75 octets, excluding the line
        // break. Long content lines SHOULD be split into a multiple line
        // representations using a line "folding" technique. That is, a long
        // line can be split between any two characters by inserting a CRLF
        // immediately followed by a single linear white space character (i.e.,
        // SPACE, US-ASCII decimal 32 or HTAB, US-ASCII decimal 9). Any sequence
        // of CRLF followed immediately by a single linear white space character
        // is ignored (i.e., removed) when processing the content type." (p. 12)
        if (text.length < 75) {
            return [text];
        }
        const lines = [];
        let i = 0;
        while (i < text.length) {
            // We're increasing by 70 instead of 75 because I'm not going to deal with
            // UTF8 or UTF16 code point clusters just to ensure the octet rule.
            lines.push((i > 0 ? ' ' : '') + text.slice(i, i + 70));
            i += 70;
        }
        return lines;
    }

    /**
     * Removes diacritics from a string (such as é -> e). This can make fuzzy
     * matching of strings (in the context of filtering events) easier.
     *
     * @param   {string}  text  The input text
     *
     * @return  {string}        The normalized output text.
     */
    function removeCombiningDiacritics(text) {
        return text
            // This decomposes potentially combined individual characters into their
            // constituent character + diacritic mark ...
            .normalize('NFD')
            // ... whose diacritics are then removed here. The Unicode range is
            // described in this PDF: https://www.unicode.org/charts//PDF/Unicode-4.0/U40-0300.pdf
            .replace(/[\u0300-\u036f]/g, '');
    }
    /**
     * Returns true if the provided query occurs anywhere in this event
     *
     * @param   {CSVRecord}  event  The event
     * @param   {string}     query  The query
     *
     * @return  {boolean}           Whether query matches event
     */
    function matchEvent(event, query) {
        query = removeCombiningDiacritics(query);
        if (removeCombiningDiacritics(event.title.toLowerCase()).includes(query) || event.id.includes(query)) {
            return true;
        }
        for (const prop of ['chair', 'location', 'author', 'abstract']) {
            // @ts-expect-error This is a bit ugly, but efficient. We check if any of
            // the properties exist in the event, that its a string, and only then match.
            if (prop in event && typeof (event[prop]) === 'string' && removeCombiningDiacritics(event[prop].toLowerCase()).includes(query)) {
                return true;
            }
        }
        if (event.type === 'session') {
            const anyMatch = event.presentations.map(p => matchEvent(p, query));
            if (anyMatch.some(v => v === true)) {
                return true;
            }
        }
        return false;
    }

    // This file contains a few helper functions that help us arrange the various
    // events on the schedule more appropriately.
    /**
     * Figure out the rooms which need their own, dedicated rooms for each day. NOTE
     * that this function **only** returns, for each day, those rooms where there
     * are conflicts with other events.
     *
     * @param   {CSVRecord[]}  records  The records to display
     *
     * @return  {string[][]}            An array of strings in the form [day][room]
     */
    function roomsPerDay(records) {
        var _a, _b;
        const dates = records.map(r => [r.dateStart, r.dateEnd]);
        const now = DateTime.now();
        const earliestDay = (_a = getEarliestDay(dates.flat())) !== null && _a !== void 0 ? _a : now;
        const latestDay = (_b = getLatestDay(dates.flat())) !== null && _b !== void 0 ? _b : now.plus({ day: 1 });
        const days = Math.ceil(latestDay.diff(earliestDay).as('days'));
        const roomsPerDay = [];
        for (let i = 0; i < days; i++) {
            // First, get all events happening today
            const today = earliestDay.plus({ days: i }).startOf('day');
            const todaysEvents = records.filter(r => {
                return r.dateStart.startOf('day').diff(today).as('days') === 0;
            });
            // Then, create a set of all rooms where there are time-conflicts. (Rooms
            // without time-conflicts do not need their own column, they will be spread
            // across all columns.)
            const roomsWithConflictsToday = new Set();
            for (const event of todaysEvents) {
                if (!('location' in event) || event.location.trim() === '') {
                    continue;
                }
                if (eventHasConflict(event, todaysEvents)) {
                    roomsWithConflictsToday.add(event.location);
                }
            }
            // Finally, sort them so that each room will always be in the same location
            const allRooms = [...roomsWithConflictsToday];
            allRooms.sort();
            roomsPerDay[i] = allRooms;
        }
        return roomsPerDay;
    }
    /**
     * Utility function that returns true if an event has a conflict with any other
     * event in the entire list of records.
     *
     * @param   {CSVRecord}    record   The focus record to check.
     * @param   {CSVRecord[]}  records  A list of all records to check against.
     *
     * @return  {boolean}               Whether there is at least one record that
     *                                  overlaps with the focus record time-wise.
     */
    function eventHasConflict(record, records) {
        const thisStart = record.dateStart;
        const thisEnd = record.dateEnd;
        const listIncludesFocus = records.includes(record);
        const overlappingRecords = records.filter(rec => {
            const otherStart = rec.dateStart;
            const otherEnd = rec.dateEnd;
            if (thisStart >= otherStart && thisEnd <= otherEnd) {
                return true; // Focus event is contained within the other event
            }
            else if (thisStart < otherStart && thisEnd > otherEnd) {
                return true; // Other event is contained within the focus event
            }
            else if (thisStart < otherStart && thisEnd > otherStart) {
                return true; // Focus event overlaps with the beginning of the other event
            }
            else if (thisStart < otherEnd && thisEnd > otherEnd) {
                return true; // Focus event overlaps with the end of the other event
            }
            return false;
        });
        return listIncludesFocus ? overlappingRecords.length > 1 : overlappingRecords.length > 0;
    }

    class Conferia {
        constructor(opt) {
            this.query = '';
            this.opt = opt;
            this.records = [];
            this.columnScaleFactor = 1;
            this.showOnlyPersonalAgenda = false;
            this.agenda = new Agenda();
            // Mount everything
            this.dom = generateDOMStructure(opt.title, opt.maxHeight ? `${opt.maxHeight}px` : undefined);
            this.opt.parent.appendChild(this.dom.wrapper);
            // Attach event listeners
            this.dom.filter.addEventListener('keyup', () => {
                this.query = this.dom.filter.value;
                this.updateUI();
            });
            this.dom.personalAgendaToggle.addEventListener('change', () => {
                this.showOnlyPersonalAgenda = this.dom.personalAgendaToggle.checked;
                this.updateUI();
            });
            this.dom.toIcalButton.addEventListener('click', () => {
                initiateIcalDownload(this);
            });
            this.dom.clearButton.addEventListener('click', () => {
                askUser('Clear data', `Here you can delete the various data that the app stores in your
        browser. Use this to quickly clear out your agenda, or reset the tips.`, [
                    'Clear personal agenda',
                    'Reset tips',
                    'Cancel'
                ]).then(response => {
                    if (response === 0) {
                        // Clear personal agenda
                        this.agenda.clearPersonalAgenda();
                        this.updateUI();
                    }
                    else if (response === 1) {
                        // Reset tips
                        this.agenda.resetHasShown();
                    }
                    else ;
                });
            });
            // Begin loading
            this.loadPromise = this.load();
            // Perform initial update
            this.loadPromise.then(() => {
                this.updateUI();
            });
        }
        /**
         * Returns all records in the schedule
         *
         * @return  {CSVRecord[]}  All records
         */
        getRecords() {
            return this.records;
        }
        /**
         * Returns all records in the schedule conditional on any filters currently
         * applied (that is, only the currently visible records)
         *
         * @return  {CSVRecord[]} The filtered records
         */
        getVisibleRecords() {
            return this.filterRecords();
        }
        /**
         * Returns all records that are part of the user agenda.
         *
         * @return  {CSVRecord[]}  The user agenda records
         */
        getUserAgendaRecords() {
            return this.records.filter(r => this.agenda.hasItem(r.id));
        }
        /**
         * Filters all available records based on various conditions.
         *
         * @return  {CSVRecord[]}  The filtered set of events.
         */
        filterRecords() {
            const q = this.query.trim().toLowerCase();
            let records = this.records;
            if (this.showOnlyPersonalAgenda) {
                records = records.filter(r => this.agenda.hasItem(r.id));
            }
            if (q === '') {
                return records;
            }
            return records.filter(record => matchEvent(record, q));
        }
        /**
         * This is the major function of this class. It completely (re)builds the
         * entire UI, based on any filters, etc.
         */
        updateUI() {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            // Before doing anything, retrieve the records we are supposed to show.
            const records = this.filterRecords();
            if (records.length === 0) {
                this.dom.scheduleBoard.innerHTML = '';
                this.dom.timeGutter.innerHTML = '';
                this.dom.dayGutter.innerHTML = '';
                const noeventscard = document.createElement('div');
                noeventscard.classList.add('event', 'meta');
                noeventscard.style.margin = ((_a = this.opt.eventCardPadding) !== null && _a !== void 0 ? _a : 10) + 'px';
                noeventscard.style.height = '75%';
                noeventscard.innerHTML = '<strong>No events to show.</strong>';
                this.dom.scheduleBoard.appendChild(noeventscard);
                return;
            }
            // Then, figure out the axis limits and other information regarding the times.
            const dates = records.map(r => [r.dateStart, r.dateEnd]);
            // First, the vertical (time) and horizontal (day) scale limits. Default to
            // an hour around right now to display at least something. Later on we can
            // add an "error" card.
            const now = DateTime.now();
            const earliestTime = (_b = getEarliestTime(dates.flat())) !== null && _b !== void 0 ? _b : now;
            const latestTime = (_c = getLatestTime(dates.flat())) !== null && _c !== void 0 ? _c : now.plus({ hour: 1 });
            const earliestDay = (_d = getEarliestDay(dates.flat())) !== null && _d !== void 0 ? _d : now;
            const latestDay = (_e = getLatestDay(dates.flat())) !== null && _e !== void 0 ? _e : now.plus({ day: 1 });
            // Second, the shortest event duration (which determines the vertical
            // resolution). Minimum: 5 minutes (in case there are "zero-length" events)
            const shortestInterval = Math.max(300, getShortestInterval(dates));
            // How many days do we have in total?
            const days = Math.ceil(latestDay.diff(earliestDay).as('days'));
            // DEBUG START
            const counter = records
                .map(r => getTimeOffset(r.dateEnd, r.dateStart))
                .reduce((prev, cur) => { cur in prev ? prev[cur] += 1 : prev[cur] = 1; return prev; }, {});
            const vals = Object.entries(counter).map(([int, cnt]) => parseInt(int, 10) * cnt);
            vals.reduce((prev, cur) => prev + cur, 0) / records.length;
            // console.log({counter, mean})
            // DEBUG END
            // Calculate the "pixels per second," a measure to ensure the events have a
            // proper "minimum height."
            const MIN_HEIGHT = (_f = this.opt.minimumCardHeight) !== null && _f !== void 0 ? _f : 75;
            const pps = MIN_HEIGHT / shortestInterval;
            // Now, determine the "raster" size (minimum size for a time interval in
            // width and height based on the shortest interval)
            const COLUMN_WIDTH = 250 * this.columnScaleFactor;
            // Determine the room-columns for each individual day. We need to pass this
            // info to the dayGutter updater so that it can add a second "heading row"
            // with the room designations at the corresponding places, AND we need to
            // offset the events based on that information.
            const rpd = roomsPerDay(records);
            const timeGridInterval = (_g = this.opt.timeGridSeconds) !== null && _g !== void 0 ? _g : shortestInterval;
            // Now, update the time and day gutters
            updateGutterTicks$1(this.dom.timeGutter, earliestTime, latestTime, pps, timeGridInterval);
            updateGutterTicks(this.dom.dayGutter, earliestDay, days, COLUMN_WIDTH, rpd);
            // Draw a grid in the scheduleBoard
            updateScheduleBoard(this.dom.scheduleBoard, COLUMN_WIDTH, timeGridInterval * pps);
            this.dom.scheduleBoard.innerHTML = '';
            // Draw the events on the scheduleboard
            for (const event of records) {
                const card = generateEventCard(event, this.agenda);
                card.addEventListener('click', () => showEventDetailsModal(event, this));
                // Place the event on the schedule board
                const timeOffset = getTimeOffset(event.dateStart, earliestTime);
                const dayOffset = getDayOffset(event.dateEnd, earliestDay);
                let withinDayOffset = event.location ? rpd[dayOffset].indexOf(event.location) : 0;
                // NOTE the Math.max in the MapReduce below: If there are no conflicts on
                // a day, the array length will be zero, so we need to set it at least to 1.
                const prevColumnsOffset = rpd.slice(0, dayOffset).reduce((prev, cur) => prev + Math.max(cur.length, 1), 0);
                const hasConflict = eventHasConflict(event, records);
                // If an event has no conflicting other events, we make it span the entire
                // column.
                if (!hasConflict) {
                    withinDayOffset = 0;
                }
                const eventDuration = getTimeOffset(event.dateEnd, event.dateStart);
                const PADDING = (_h = this.opt.eventCardPadding) !== null && _h !== void 0 ? _h : 10;
                // Ensure each event is *at least* shortestInterval high.
                const height = Math.max(pps * shortestInterval, eventDuration * pps) - PADDING * 2;
                card.style.top = `${timeOffset * pps + PADDING}px`;
                card.style.height = `${height}px`;
                // left & width are more complex
                card.style.left = `${COLUMN_WIDTH * (prevColumnsOffset + withinDayOffset) + PADDING}px`;
                if (event.location && hasConflict) {
                    card.style.width = `${COLUMN_WIDTH - PADDING * 2}px`;
                }
                else {
                    // No conflict with other events -> make it span th entire day column
                    // This line here is necessary since, if there are no conflicts, the
                    // rpd array will be empty.
                    const colspan = Math.max(rpd[dayOffset].length, 1);
                    card.style.width = `${COLUMN_WIDTH * colspan - PADDING * 2}px`;
                }
                // Ensure that meta events (such as lunches and coffee breaks) overlap
                // any events that cross through them. (Oftentimes, if there are longer
                // events, there is usually a short break in between, but it is easier
                // to make both events additive instead of splitting the longer events
                // up into two separate smaller events in the Excel file.)
                if (event.type === 'meta') {
                    card.style.zIndex = '1';
                }
                this.dom.scheduleBoard.appendChild(card);
            }
            // Final step: draw the vertical day-dividers so that the borders between
            // the days become more pronounced
            drawVerticalDayDividers(earliestTime, latestTime, this.dom.scheduleBoard, COLUMN_WIDTH, rpd, pps);
        }
        /**
         * Sets the column zoom to the provided factor. Should be a ratio (e.g. 1
         * for default zoom, 1.1 for 110% zoom factor, or 0.9 for 90% zoom factor.)
         *
         * @param   {number}  factor  The new factor
         */
        colZoom(factor) {
            this.columnScaleFactor = factor;
            if (this.columnScaleFactor < 1) {
                this.columnScaleFactor = 1;
            }
            this.updateUI();
        }
        /**
         * Loads the library
         *
         * @param   {ConferiaOptions}    opt  The options
         *
         * @return  {Promise<Conferia>}       The object
         */
        load() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield fetch(this.opt.src);
                    const data = yield response.text();
                    const csv = parseCsv(data, this.opt.timeZone, this.opt.dateParser, this.opt.rowParser);
                    if (this.opt.debug) {
                        console.log(`Parsed ${csv.length} records from file ${this.opt.src}.`);
                        console.log({ csv });
                    }
                    this.records = csv;
                }
                catch (err) {
                    console.error(`Conferia could not load data: ${err.message}`);
                    console.error(err.message);
                }
            });
        }
        /**
         * Awaits the loading promise. If this function resolves, the library is
         * instantiated.
         *
         * @return  {Promise<void>}  The boot promise
         */
        awaitBoot() {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.loadPromise;
            });
        }
    }

    // @ts-expect-error Expose the main class on the window object
    window.Conferia = Conferia;

})();
//# sourceMappingURL=conferia.js.map
