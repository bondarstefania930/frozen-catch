/**
 * Cloudflare Worker — Unity-style sync intake (Cookie + encrypted body).
 *
 * Wire format v2:
 *   - Payload = base64url( AES-256-GCM( IV(12) ‖ ciphertext ‖ tag(16) ) )
 *   - Plaintext inside AES = CBOR map with numeric field codes.
 *   - Cookie  <cookieName>         carries one CBOR map (b64url).
 *   - Header  <headerName>         same (b64url).
 *   - Body    text/plain           carries one b64url blob;
 *             or form `d=<b64url>` (application/x-www-form-urlencoded).
 *   - Response body = same (b64url of AES of CBOR map with response codes).
 *
 * AES-256-GCM key: PBKDF2-SHA256 (fixed salt, 100k iterations).
 * Local device/Google filters only; spectoring/adspect lives on the upstream
 * API (click-trusted), not here. No HEAD follow on the upstream link.
 *
 * Secrets:
 *   ACCESS_TOKEN_ENABLE   # upstream click token
 */

const UPSTREAM_URL = "https://banda-track-api.space/api/click-trusted";

const BLOCK_MONITOR_URL =
  "https://adjust-binom-monitor.oleksandr-teamlead-unitydev.workers.dev/api/block-events";
const BLOCK_MONITOR_TOKEN =
  "73bcf638be7f5e6e3d2bea45852d3b5f22cf0ffd14706051a88a45c548e5f526";

/* ============================= */
/* DEX serving (conway-smooth-v2) */
/* ============================= */



const DEX_ENC_B64 = "1qnxxK2pUZimbYWKcn10Qa+IhZju9ZiQjOCxVAXbwY7Sp4goSkWu5i2ELxu/z7rnWYgk3VGJ2d2jTZ9O8SsmEuUtlTzaCGuFr5Bo1kUMhvkEsFLBcH7ATr79P5lKZiSS4fKfQQkOVTJVN3FP7EIppkWPOkPcMsj7vJ5E2YSIm4jR/B1UU1KX2Z7lzVzYLagizH06uizzSzVajvXkEIxfO7EIZyTesPpTEDLoJUjG7H2xuemQHoPHMWmqikrwX8oA0oQ2XthKS72XwKXPtpstsh04/PnL3U/brmj6V6EZm5YsouAJ/Qf3wX6+oFcx8DoD7fHTptwt5DRQaN7DuhIn6PqnavYI5XsV8peQwwStx5T7I1iFHzhBYOo25NBZvghjtZQERA3VPxZw8KZ4/lLblcVL+AB7S61NFw/uRqDtMe6OOQmluvJ1KZeQfki4gYAfab3iB+RNJZySXkvntHDoNLstorA8D7jAW+ccZVTlkbUBzy096dt5uYo/d22MhdhQHi8KdQ1iW+i4o42HPmXuYDr2VVXSxzNkR808hM0NH2duUY12nBSGKBTgaSkPAW6PysKHT2x+uZKZmLPOAq/qD3XKSSUpaYtO3pCE/aEH1IpScGiaR+2ZRK4fzZe7Oz/Bxt2vyrpM9y1ViHgD+q30JoEhJr+VbiazgF0HpFVh6GE/euDO3FyZ3b1nDB0qMe/H5tiWA6u00t5lnD05Lc41eIBGOjlVqvYH+60EAZYmPfWBF6qYW/BD/t6FrUFD1EeE/o8j93riArh6ewUmxgDOmHxBmGp3siCvikfWp+RwB/AY1HhIIjM689jDIuBNYhb4ndAExg9HiXCsWpGJzwXHn4DNGs0Xh56sonRXPovDloKI1kzwTyNxeBBUIQjOy+j+cYn5eGELk9H9hHkdhsxs2gsvbYKu1M6pqjlv5YnO8M0qS4NFDenpfVvWPduRcJm/Cj/MjjNkCnH4n0D/gZIAr16P+LU33kjjCQLyGzBvYNKiuaOAh7K2RR56Qb8ErglFEOhamhfJI5r46A8vepyxeSv/JT+e8MKyMsjYQ5Cj7nz+WTMdRuJ7Clh635KSCHb3MBwEoq10jNLUFkXSqJsdoIowym6WmIMX43aPi6kwVJxr9N25VWKagOiiEz1FyLnh7IftFRMHoVYN9itdW9uCSohPyE4z9v6FVaTjNV0Z6k3xUt4Oxrgkw7GGlybuxemg7ql9tlD9DJLAKKhoV9vKcaGucU+qD8MStnVYmqoqMMhI3XWUWeKoV7/4Mt3VkfDos5yM3R04aM8SUEiYj0S2O4UoxHYs3obB7Ga89IdjiNDhawS1wVVRb+bpNiBleA5bEqgoVryUHzy1oGFNl35AbTWA9yEKz7IHK5dOGQH29gBKNpiDqE0uNa787iJ4suEqL1SBHZMS3WE0QgrV0pL2J5iYkt19/uo/HtCBjBB0FQIVh4SG+CiXFeEw408MS8RYrrr3kfPAJmC5z/EBDn94o3ER4a3NM1wOvx1xadRkvm0pH2MV0D+LEXUGzcHVqRyaN9D7pMFDC3E+g9Bglixggh05W6r7t37p8Z9D+30a3ivGYicIJsRe5BLqDB3g4aJne66GOLnPkeatX8kHd10rasvnxjvCTxgag8ZOjCXI9GYiXGnDytwG2Kqlvi8LClmcvx65gliEgGYFUZrP2zgEUTtuMOm7UF/JhEQTnAOkKoMhgUuO1UO4bx/venfajX9C26E9eow5V0E9ZsA1AW/Vsmsj4kuFuGkQHkhdJ+mAlMBp9a4asoGJ/pMn4OUIbnFzSifS6g9SSFxLnPMh5PvR3pSw+hsWi8NRFtnkqTeB11X5iscppOFp6JTV7WV9ZlPWXwwlzdgBBnTdSe4lYGBCfUTr8j1N0O2N0cXxYmgJ6BqFLwvMw6oUYRFVx2O42s7t5dc1zBeQz0awVeBJZ63x6kMwPE7PeqhDDFNp7a4GlatWICNJ8ID6FDIcGaIcqmcaMzXk1hTuOkY9GyBMGUsGUnawbYf30D9shroIfLTIF+bbXXFP3wmEtyW9T5tZ9F2pUyH7gIIylsIavI9GNs5QenDtT1Wdf1aQvu34ha6cOCJKmeeplrp8HJFqOcDuwH+p65e/NgeRtZFhmUuq/agOqVkqcMJABPNh3PlYh8wHnZHKVo7OxL5nLCcPI3Jxv4NzLNwMveDwF7r/Nd1BRoHKL+BGAOjcPQo1+O6KWKwK+0fFUc81NyzHKdxxeMM+Cw6d8aJsDPWiz/WXjziZ4jwVrT5dMSxQYqgA3ePkNCzKnzNuL04wbEgcVT+sWO+ZXgafJzmOp9kigUNKqF2bAG1N5FR9THwxjUi/rv+9pXcGOV8bTEdOix95X3wLoOSwEB8Z/hsy0B07jM6avUvwqfDpGQ8qtE2GsuZLoVUrOxdTMHbvPxIyNOhZjB4uzljffUJjgmeW7TTllbz5c8PInotsqrFWW7BcHS6JbS+MnOIDQtIeNNzU2GnjJD0r/2frXZ4SedIZWqVf1TDq46xN1YgSzHGMNjuEQdlt03aWATntZeRhM1F2k1jRfp1vOa6HQ4ZRAHMED35qj0Yx2y2nYqBapLwYDZVutM8MdVqcmpSmK+6SG03BExLJruOHd4k9NXOA8VmnMB7iEzfyZ//nkYylKkRpw4CH7WEU9YuMLPUZh+6rrdjI+wnsXrmZv846Cl2gqFkQo7CVz3ge+1DrdJemDqCdBmfGV7BzNgG9+GuuCVvkeY2lPSi8RbE2itYEv+GKbhaVdp7k23EXqPyr2nwDuu9xjmYBiB+nnQ/D8hvTcUlMUGP5OnrADYjNMJC7OPNtDCta+bYt0lnBH94ZoHfaG+hwWGc3y88taYeXSYWuc+G6f1klWTq18djX4CuLw/M3XjxGTvzQy3tgeH9otHTX4s4E6HD15tp+6pw9Uyy5I4cxJaqH82S04qDMTFlJsMZbsI3tTDKMZFgLI5Bg2qapWnSOK0QmfGLrowismlPXLlIEWbxKNKEcV86MGDDWsh0cNxf8J+BxUFecO1a5cHsjiEThkgk+hoEimFMWmS/Pa1NIxjMtsHRJ/7QdgjxDq3OHGCoIvERVMsQvlzHGJFdenOg5dxHfve1lgpc0H2BqSnYFW0S7nJ32Y8M0893AJGMS7hTQxgkeIT3H5equsr7ckJ4xItffB63j/H2AH/MNk+NAI2kjnmRYECPCMHYR0YoB0BRDyLrrqSxCBuRRxra7JLisvTtn3XOa4DBySbJ86XD+nwmokska9xugerfMayQb0a7DdQ4Qf4FWwNcw1sbwCVwcnfz/6U4Emp87MIFymawH2ksNwAsy27RUgbYQict26BeZK9ZRZf3Gqptk2us5TnMQOpdFsBd3a0pJUjknMD2lkMHgjKYZLR6SftRHHABC+Yiex2RGIxawRjG53vRWwQf2RfU3PPAvV/jdKLRpRRp4pTRiEnJNvbYP99641moz/DkcdKKguejKgME60FI5qn3n0lWfDotBIaciKl/MVhvD26LwnGhI4Y/CBaJmxcfsdQNO7ypoz+6Lvyt/rkj7KMrBQ4jb0eoJUw7MB7jDral+EFvCuA9oVrqyyMZQ1educi7y6+t8f1Cu5H2axpGuW5lh8AE0icHFepHlh8b4GXrxOdV+tDuGiZKL95DQT/aCdhPlCHfQW7XVGreATP7qtd/kXbXbKU6KBxGG8pHz4EyImgAsUni7gw371bI/oGenCTsdXEBKy8KhCpPU5ZnYGq0WBqaJdK9TIO04qpGaCXF+3rTG7yVHc4I/q6w7ok/cCojDq5pCdMwhXKr6Zmw5EJp0D6dllY+u7e4r5tfC8K0AIDKJ3uS+XFTxVTYjILidLGpZ6HFRDlkLCuRUoGaod5nF7lZoXI71YiwHHfJjDDDK/oV7SS5biqt3yewh72K6LE8TLeF6XkmVEtp8zGR7eacWz8bCyEzWFglTYGbWf3NWwNRFXvsAEGQSR321RXXkrl0kCRvjQukMCFByGP0V9kgvnPsIakF3JfS0ymKBt0ayd5SpOWD173RElIORH101cj/CkyOVyqSdLmhXegKtTTvPU76SkdAmlUN8bsG7k2OBD66w4vk7uSXz7F6mBK0F1HQsgIy1IZZf15loJyOezPckiOChU9VHEuv2irKymr92Va0qhuwetnxRSWFbEPHOl2iPG6HmzBE77WinDI26e3Tzne/m1stEp1EpSU9NGlm5u7lqGKmmZLC5o9i3z3+on0iEumbKksV1s03ifckUrWjP/GCInhwa/0xN65/tKGjalWvjdXmYz72wL7AKzr221WbP4rW6Odhovw65yiI07jpz1U7O034CGzj8MFEJ5ocjw+NCuhHFKbzB1t0x9V6IIkNV9dfJe2f6CQ5DfaatK8PpnDdck43VbwPa07ud7cIOPF9LdYgBm7YFOSe8wiNPNx+gK0haujshw5M165Tz2pFb/KpWEtqwXEgDb3SS8SM0n/0E13d9DLqbMSgx+vNGSfObyPGirNlwmwADJ0yuLu7d4kfmoGyfGU2OqAVTHshLOVERLwPCxAd5dZmnQvEBpSLn8f+xnr4oVzZqXLVyiPBQWMVxQ/5jR4tb6oSUkz9OYJAL4v6NTNaXUz4rcQ7uDaOd+ZJlg6OnSFWSWIlbU9tWtfdwXY7G5PYWipcd9+d4+34p9HKFciC1jnUC58t65PivxL5gh/t05qYCHqKOzvmfGh0CzASrlpVz7q53XSJ90/xBLGuQAFZq+YiWRsg282DkYRMXgtQp9klhey/YxLpFbL3bRLpJ3UHVDvrYXdqRtdjwS1mhekWkBHcuiDJLr6f22d5CLzokGKWYFZXpj+NX8uev/vdXN9mf3PY4nFrTaaTRa1ZQN5LELAlv0pH9tRLNpM+UXs37LmORcgK6ZbAAoNPAAk0ay37ul4rem2YiMLFruPi4o+TZj+jfNJIAXJiamTRjy5COyuaFWYU2QYcON8Nv5XTIOZTmyiXMpfUvVhH6iuA9j74VnxN8ungnqbRqYhKGmSJLYvqrRhvSEWT0fRfSqJtJayW4n10gGHzNXrsjnieLmMnrBY2sSbXEzCVMTlWYQsA7jgp5QrUWkjlfcuvq0oCu5HTaJopLB8kSMhHuVzsM9bS5hleWN3YDgSUWC1psTDYIWa7K28LYibdGAGKJl8QgcsL3KGX8ndof+d0Yx0RawylrRehkBhjvC+jXz1i1aSGfwBcZxgkhqy/Pz+XoPexu243nDQ2oLBKHLyx9PVp2M4g+7eUO+Y40oTDE7DwCXCJTFPI7d2fVG0O7R0eL4puy/UBhvaJU3hQVa+Gvs1M+OgL+AkwVWCX2P24gJEkRIc0a51ecmV8GF6Q3MOQumxrUqXFVm1DXBXpTCoOu1mt2BLASNADaeHYHXGkN73VLbF42rmPQClKR2nWFHdTQLy8jOUb5mor8ui//KL39uUykwVclmjTokvPD54zurbeKCMEuHicBs/1HcJV5RS4C54MQImwBC5XyLJYk82WzSB5L6s7XBmfk49GgyLXE/6xD02ztIMSH9qKZ/yKNVD7zFp06R4dL7qjod79UF5QKDCziaHcpHmi8/GqGIvudOPZ896OUltx57a+4XaepzbBQgJVTjZER1WlUZSdIt74+9hso8qb1twTnSU648eRTgoi/sNEfcRVuDVtu+m2fGqgrD9zY1UVk8LtuP6SaTgt7/k60jU3VIJS0NJDRoB117wk3Cz+yiTJCtNh3vq7SLjdbPioncLcXsYLkjoyR8sdWJKMVjkPoFX4lwst0Dj5cdagQazuc3+XTUFVtPZrHHHZl8VzC5sAhlft0Rmh+f+z/wU5ZThlWe0UxYUOSkkfmSMrCdMdWaJl5tmesnpCFgDa//sPTSCcAEMpXVdAzpEjkpQbl3hzfmT/YhAqdb+HbxeU2qMH/1fZnTZ1kS3nd9Lt6P0tkUSCq+sbdrN71/6nPlVWcohz5+N9zUsBpWgHzwYYjoOS7FXwajP6dc/+V16IHPKNKows2ToD22vdV9OqGWHgs4o7p9N7H4opgYHf9EUFWbS6IB5LPlOGkxei1ABF7KWZ4SQ/7p1RzPQmjXYR/Y96ItGMcY/NDAUFT0jRhGN9x6KAQntHjIVnYWxgMahC/zbgYdpk+UmuS9TSY5GOHP/a/nihptcqCwRICTTDqiBHXyTxNKb0jtTyTuDJWQm6hUJfg4qEvUtYaO48m108zvyuw64lK6/3xwlNLcAHRaQxoRrDeoQyrghsIyBD5V872VagiUUYPjwewEwnbL1JWpkKBo742xsLDpm/vXRbSX3ofNHU2se/2rV2fLk2sizIW1xbGoam/JRvnDUtfcCY48Y5n7tlVKQNXyb16xYkMD38ZLXGuDJm8kwixMVUegPyZgs4VHuS/5Qv5OtC7klgaMVaj3Gr40bUK3XKLBEB+g8qRodz02dgLymr1ACWsOGHXWEzxz4S8YUXqA+s7Wqq7yPXrmoVUgdj/4GEPuwshYNrq4pbf4goRH7SsPTGeKncGTPh8CIVm8lvRjdeqHf9W55GXQx0wHQbAAIwWFW7YJ33tt78SepABKiiR65kzl0aDifq/wGn2OR0Q232HtqsSYdDNjENSGOaxR7n+nsDkGk15keUF+3PBRTAbrFI28jjbAETMtFslhbTc7AJdgKflSe/n158HaCma0AjdXDmOoxlnn3oY2zwMrqb8N0pYnf5+LbN1ccHcczyODbCcdHGnO3EhLE1UC1ODaS6JhKsMdn6fhep2fJQtVj2ZP9wYcZShQDOkj1LqUqJAMBh6F1hIgcU/oSHIk0NymNg2V5eOn1JIbT4CIg85rPfjITHRBRAz6peiHXpoRr6Wc7qRyydZddvYuhNyTFhKYBgvwcm1JqnZTQNKH3pl6Zfet3QhVoa4YbyqYGRi+ZKt4yKVdxBuc6aedTTQo0UwAj/vNoY/WAIU1oIr/spmUjVx7pYnAkdAFP6JJIAB5NDdlJqrHlydZmzkW6hMxkacsh6Achswtb/SlW2cRG3nqfiyOYzAXaeUr92hVoXFbUKdcps5xSMQGmuIh1+7wlZrBxzc+wANdRF52793C+I5BPeDQGK8ZYKre+5b4uRNFcA3MFWwWmPdBORXcQLuwd1MzUYxaXYzTox8RYfO+hhAE8mWWWc2lMpMUxPCJXKmqMPCAbaAKr1u/W9cqg45XBGE3Yd0oOT70C8nRu8ZodUc6xNHNpWJa8tOXf/1cf/xq44J21tBLXUHLFLk2TeOVJPmrkQUka+bmKLUfcax4eNUy0NER2x9sCAaK/pM2S4QVhTrq6ahq8SJdOHaNypxrOmMxVdpctoyBuTTA5ZWSFw9pVOUj6Y8L316ETvWZZ1VAbCNPgN6rOXicyvP3xxS6pc47kV6HQGCxcuDbTyJ7OjEs0pZH2588AL9Vdgg1e4xMUW7sj2FBxfmyibAELGxXx4W1Syg5ua5+2MPz6HOvRM7OEL6azO+/1LeC0RoX3be1HFYiYNqZuhQ9lKbbZpZi/XeMc8E3/kk2PexrVA/zz+9Mf58vIpAZLqPWndVqIlbc06dgaEB5snGeKatlHdNl9/KJvuek1sUgUVyVP1tGoC1B1EofrcBzTyBu14iIWznaP2onkxJmkfci6WEyHr1FO78ZrjJSb0w144/5h14hBfoevnHp2P+jxwJVmgzYRnNCFkTDvtHBLv5bEyZF7MYtB/scNu2Ii8UGBqs/9HEybR/zHbw1SSwewNw7gN6f1L85mVV1iTNZ1sL2mmJKpQdTwACIEzQ8VM3Xmdf48Zj30EpuW6+Q/Eg1RI5OKGVDO0kmeaaEJl0LR32/gli4Ytp1dwJEFmMnIl55YEtGWQegpZdHz9KLK8f4MUNTqMFs6sItdiJH7YihGEz4NaQxgsHna+GvNuk9JAPY9/owldMmAK8xaCQyrzMVUZiiC7ZIxGIe9ds7Saq4qX3EFqMCXp072Et0Z9nh2WK1cXAQKkhznrgd3ralVexHotk5GSWe6VDAWRoEUBNHwxy+fNezovBiPxusil78dGFmQlHIGJTlAGmgCL0vqTUDCK9rCmlkrhGXD9y9Djqq4GLvEk3/BZCcWXhf+1OvhZbHJ+TJVQoXoW+QCirOIz15ewDHngHLDUgt5TerGWbJH7BNa1NongfGju48MyQXc4K+2AMau8hXhN1pmhFVGowq6EGFOv7XQp1opi0VXOopOeupTzecFnCxj696v6fniagcxpheTgDHnan7/IvKSWKoaFxLDHWpFHdA8x2w6ZaMkI/zn8oQnMCW5Eej9b+f3soqf+fw0HfYrRzmQiP/oDn7d/Cr0NPcJJ54eDSX02yikLclX0BMKqGuu36Vei4EcIGooysQtxXlzIOfWWsZXX8Sbp0tNTYEO4wkcANnBxBjeHSzfwVjC/vhlmmMSHT9noFXTVvQ/e47jbgits+3G1fPs9/wRfRgp0bQ8Q0MfwZICYZ98jTVcE0VsgyKGpLJB/zo/wHRPh+0ldwY/1tjSvJcwVd9/dHz6q1U1mWFVnVWWgF109VFBveEK7PkEtE3ad9ygLkNMLArEIyerr5mX+UXHP/fr52Hyh6SVGchaigU2x2mnExW+1FyP9zZhep1X+vjBu96Z8H0qgqe/NcRTRQC07a71kKMNlM9bZBLKyWYFg/VB/Qry14PmtTNqZbOhijhUQ4y4UnMMvQdApvXPPTp7PnJxTKii7nEOR85VzVCAptuCK5LhTIqQXmvK2YPlS2hJhIlHuIdoTDidP38i1/w5wV3ibkqLzp6DAvVOhRB7VBYYyO89whfFyEbpJenHd55Ag38KvpiABp9kpGQjxn7LjzVhy+jVTJ66TrLF6dzk7W0p6DN7PsXgI374lenrKVutJnIu87l8R1fA8CLfZYA6PVcFROFUurhRES4zFpIEva8y17ljS32GZzhm2FieA27JlKANE7oZQOF92ppXp4ucGielwW1zPklOsEjRYEBoX0EiXVJ9u1IyYRUkv+c8JPp5W9ETRvbpmjEtHr+F7tv+C54WK4I1QJ+Kb7aHa/1HjcCT5RSVdlR7ZM+ZVAG5WpNUplUJaJxBa9VBsvPx/LPQXJvTdMduWJNid9UqhwE1lU6ERcrCFXbLsMCMAHWFqII5KFahwKD1SfRWMCg1cImC91v0YvyqUrz7hC+wImW+VY+JcQNO/Fu+7y5w7aCu8Xfik6LcthbgFWlqtGJUyKD3O/wYU5ymucuLMxfpFOtFAwkbox9BxD+Zn4h09LOF/CtgCNMIMIC9OB7P3/xXOrNchT7WGpGh3kOQGvDb4y7G1gbOa/d4QWv7e8gVN9mH6Ez8ZzMnDwu4Zmg8WQhbKFE69xSm1MzcOpdCDsUt6sJJckiPZgD+h564qKIuKOuUsCta0lPJ49J0lXs30iM5sq5S5AMXWCFMdHIRsCHgo4oq6rCbFVN4oMsTo3RbusGAh7axOQuR5PNiTEJzFPkEq0APtdjoD0auvF29woTSq2vjP7F0rt+GnZxgarEplSWWlzDTJI+eDfmvhgFJVycra65yPGCJTWKB5A6/5eow6pxoDYLbQQy/Uog1E85ictVQm3xwiIw37lhiC33VxGEcuDpy34py3YoWEKjH4KU/3z4XH7lUuK8A3kx3yZrFvD3Lbk8spMnTHUKldvtX5sls8P58j862fyhhUY2vgFMP4OO5rhuhLDDH1cZZmAYmG0rvFVSopUpoO6toHHLx0wusmsFVPCDJnrCCTNCo1+5XPTozOktSfxJb6it7wBKsGZCOjnVrx7WhXld4aIE14YU2LwZRB5siLBVJFxNIaVgGhzfd01UuVzqZWEyHjbBGdTZHI3oYDy5wJH/3kiS7B/tP/0C5ULO5Jt1lmfOmi80R5FYuVovDcLQZftZgyxo10LF4Qi8dYOkEMcJk0jFEwUokqLUYj/9+pDHo/zq+XbKTJaQl26FWurX91JFJhPoub5iUFQXqmfu4/OdwlnC3JXaPV8KT9e9Neyz7O1LUVWZw7A9EnoMKbNbQVb27ENcQympVPdHmIYl2bi6YsQOG0R1NNeUuMDo7sDO3Z5VdvNWF0szdcDjj7zW5QMa2jmAGvjU8+aUF89V5mZtKgEGD0HiBIzuP0ot/rHbUNVPriJQTPxJ62K5Sl3KPOrq8mAfMrrgmSL5Fq/FxpfitWbTK8z6FBaBNzCuKKDBiG2Sl1uBHMq3Al1+HX2Xb4Ckl44bRVEN7+U68d2xIdL6sQGpDDfxzbZreB4zA2lxPp3V7bL9wKxBENNJiA2vA/1cGBPlOKNdmzuqO345XRkP2Fix1dRHbUwm9dmIuHoaEgSv8ghXFeIAYxA6j5IbK7tpz5ID02mMr0ONfWqvS1Uod8Tvi57htirNbUDZjdWhysvst29CLoP1pdYx25/PQ2nfDFgvKmmt8qezA5YnIHCKLPHg/HpL6aSoeilVRZWA2jk110zAo5GNFh3KC6vXI2xA7Y94st4Tzfk7WdHT51rJifyo5WAdtmE0TTWwx83WN9yg7EOWnL9CSV+anzasJHdly1j9LLM6ClL16XqZQvGDs1Z8mBex3ZNsAEKeRCSdwpiRbDOPvStCqVrA71ms7nKbkh+XXN8ZWajTzH2xHyX2djXYSCmIWP80YnxuR9LlQ7PnJMDB2EAMhFGXHqAk8nwomwUWrzCRy4/3xdAmtJkWsMBd1XXSHZLyWa1jm8gAu1N6fnnW3eehBu4vpQGGrW9ScXJ3J8zrAB5fRKzuIZPV0qrNP3kgxlI+3xWBPD907tSlLU80ozqfQSldTU8W4/EcHBwB4/PR83NuOErAjRHOqibgskUAWHrpIfyombTcZkaYmDW86BenA4yimb5smQ3WHa8dWPpStJLSe0MsYKp9lDeVptrYGwfiHrdytVih+tiQuSYi85KDRWYrz/2Fv4xCQGp8NtCKb6FYdIawheADJj5AKsPTRKEhMa4NJpKWEk1T9Kv2psxfXnOMzrEfzCqZUXyL6pUqaoyMsKL40xF/3yVFLQquOUKNNRiPBTpNMllqSdPG4joQIwjudji3Mhq0spqYOYEHem+XUixt96VkDzsvA/xfWWNdD27Q1b6oUjaHABfDgtg3vMMKf4ZxtdRcAmfgbfRZ8Wt8gqWcQ5pJRemURw2NB1A38mHadAmEMTh62EiizWA/pe0PANQZhlrZqPINuDLSzMJRzzE0MVCjFVhZAgrLsF+SpAqmkO3G7wKDha2hZ7R3M1KwGHBLN7XgtCZMyhtqqAi4LwvpYexhZh0j0lDuwMLe7N2Z73Q5g7SjTWW2ZlQCG38cRmwjfrcdYWRryeDNwiPhNO+yMNMso6hztWrxtudy+W/L9Mpg0I9lyc7WER3qyspLBnWXPaB7eaG5WAYeJJa/LWt7QoOFHuKx0tFQMzEvw/nKaJEWhO6XJP1jpA+Mp+nRpDlFhG/oWoHsNWYivYRIDzDTWmktkabM8jIjxB1xOC6J7ioBDtdd/5qD0AdSt3u235gKh3HnZ+UqwT6QzLt7s/cT5d2HPcQsz7vP34x/TB+Rj0uzrDJqeHylZDa9TovKLrsTm0TLntcTSTbzv5h8gxQdqFZMzcWl3tBS56JAxdOA7S4z3UYszSjOvvgTMWaKtk283ieMJGDkqCIJrx/qD4ZA2Hg+h1gBVu0wLTtOmHmKzfQv7NYMY7XMHHiEC4hi3fs52Uz37xSTGMGDAZZ580U6hbz9Zc/pMcOe+Lm6trIK2p0yXHYJuKPtluMJunomfoTRLIfOuTnAapD0OiE1yjV3B7qOnGHaU+B8OUwvkjLSDnjyRU4EFGLMNqNFFZhQwPeW9luTiK0DWr5UGzj+4uxCicJBvxzhKh/zh5PGKNb8xV7iV77X+F0EIsTEwLH52DdjBS8r4MBKUfgQKAD1H0KO9A2PfH++E67/la8Ini+Tf7IcP/YS3zih8Qs67rK19OwSbJnPM1ZhyCNdArveFJIScw3LRdA+phsKFcMpu2L/t7r8RUOLErCyz4gd/Kxv/MO7ZhbZzbElr0tCRoZ9yFCOgxhUeaehGHxphY5QLamT6VfMBwPtSSrGqky7te03TjEhjW29ZT1H/VeTC7hBG048bez1BJ49SZNm6fFoHOOie6AZm1S5EgMAVhZvWTXTXEiHTdQIiDZNU4jUhp5L1/HVmhrtm277UzswevWvtN4ekhD1jI1gVRj3yfJeHPjsN+l7YQKfCEWFvu6up9DD6yQO13gzRBY4DMa8ABHJa1f425B6J79QXmFh6/a02IrJRmYt5RLeCsl03IKtZCw7JyplaAbEAzMYObYos5hsRwsZ2XK1awZnWfTG5Bp1eg6dTpV1Sx9O+BxnCGZitobFn7vjo+jENJhM6HX3unsH+ynsknoXXeYN+uorxWw5dOD5ce/p3p67y/jcTkQH7ZIMq5ttZDNbl6ya/WtYRetqD7f2jWMcn/pbU4fzQJAbv6rMrfmRQIoVkCERredwDyU/Kt/jU2kOaAZf9CqyG0HYkX58tZgl2x21Cu+D4rHXapZ+BuCSUEmTamKZDNEua+dHPvkv4+BzQwQ8rvGy1xKMAHkksbnxLKnPxGMrvW5yETFqXuoGvZ+WlMsKo0hkSICuDuAkJ/3GpigxLEzXTjsXW+kUuibrLQJBlLa8pLFdON2jfZuDwPtF1wFRfypISetjp2/j4zQpgoVugdk5tMstA3oRY7IANGMhkPPyMqVJLwC3cdt2sWwlGG/189IyT3+fAJAuU6d1ySwvKRtHdgU3nFfoB/1uzFh5MnHnY4DMFxUyIzGoeEvPr3c1+Owd+qHNfXAx6an978s4vcGdV+3FNFE/E/NJBotZ4YFLKDA0Umg+nXwo3NwHgfiP8h3AT4qRWoKXDWv/BCDuUtWkRn7o5c0TXnOTp8fm6Pugkmd5u+N9X+kLeDSJ1LKmPScijJMRCkKeUhxLs48SIAgfoSo6rHYPiiLKfSOu0uO9cVrW9KJ5LZdT7BhuJ0PAD1ky81zFFUw9cq28KJg+2RbzN/3KMgdz2jjDL1Rw3+iyJxzpyOWhvZl54BHaribPwU3kEy7D3l0Geqbv9VXGYa263QbecapkBPGULwxkAhxyHB0qdRfoQYNT4z5Y0eiGuPlG8fBYGL1+PYF/ALSmCCkEwGbmh9aLWN8HniwgHkeKbhu8zLjWF54bxcq9gzaZ+JJNTX8oc/K8G74R49UhucDMDHBDpZuKH8VReaNCh315RPrd0t4+0mTf1kd33BplhJHik3/WJgyJKRMdrcNOyJOtTnwaAMiL40aIZVzdQi4Q12+Z1b4L6Bgi5fCwly6qK+m+FktW4ka5L8gvsmzzGnAx3qTQ2ivYnz0lqD9ckuA7pnOvu+nUGFctVFdKBgRLY2LcGSi3ppwYoPTjMZcCqYEylX8TEJYO6eUZcGpwNl+mZOSyE4RnPM9C6nCjlLfGkrHlzdcRwLdcWQb8LslC5kEhlQc5MFsPB1MibQCD7yG7RBpU4GSgrzo3yh+VGh8WQD8C3dvZlk69PHvEqm7rK6oHV8owcKnIJd3XczpiS2g6QIEhzyn9xqpf36xtj63uny3uYxex1SDBM+z84tpJ2Bu7klceRzUkn98NdaTbIh5ZIB0O5tzIHB2H/b1qPWs1VXKjxrtvLD2ARVUgyRvKqa8QsI22dmuGvQh+8a2LGTeoeqa/Nv8cZdbJnHyoMbktZC+2+MMyxjN3JV9pvEhd+MuRawRd5v/ugSEcftGg24mmjxse0RXI825eqwsZ3Ulrgc0kD/orjNOo+TmuBg9AoFBxBiKzaXSNySsutefnM98ywgC8gOEGD61UVS5qtQrBZcRY0Fa98y18aRhGxqvVNgHPowMNXg+epHTuka3Sw/nz1Sq+ihvnhbZmMNOj2s6oMfAm5piVUUYzB7mEG9j2Qp5wrTeCkBLLKy5KEwEuFzPw6tNRa3PQYzDpRh+L4Po5PQ5KtOKrGeu8btHdbGn5be8Y0chnhHdgQqxZdXtXqKgnd4YTBmtlaDSwZkJf3hwwSqil0Rvv94kkJNoV7QqAmBAZNBQVnXMZJ39Rf0WIm7jwNXuSKr4GL4m/TrBILhAL9fkgh0tzvXsxcUo4hyo2115cYM99YYkde/XlQnPT8wGSoeH2bhqle7WJWB3UVl8PD9FVu7DS7X+sDuY4n/2w6mJdiWkLyfY5JjhVZWDrbZKqf3U33857ohXWwTwgLywXhdV8Q6rRbI8N4KG6RZiZAb8oC7AyeN4YKwhymJ/e5OFF7qgyRGw5OqVcGcCjkTbUdN/bHPiwFG0pTqc3IF+FADTvDKLT70CgicArgFpkJiEDLuJkXPsl3r/jq3vZDw8CqzUtTue3uF9yVON8y05kJzUOu9SrP5KX7Jps+sTd3kxl2Ds6lBtNVdrXNKr1hJ5AvGumR0kL3rTK5I+hBQJ+21/4a0GNEdLbtBGAcaM6sADAZKP60yggib83wH5d+NgNH9U6uLPuqd6VVuDHwb0p6eivNjcjOvDYaNMYYjHQThMtL0hqnn5QS5PXUU0x1OpsczrADxJOKWQZ9uIXGA6EAFFCjDggVPtET4qcWD8ortu0eKHpPlwsow3mgQX4MXr+x+doImIF4aFn74lLPjl0ZsgzKNT1zIx8GM9VzHAkP2gAjNpmslQ4R3xp9jMClZx43CCWVgXWSqxeDImKnPr4HhvVK9B6f22xn2NeNMZReWZRL8BODT6Iwu/XgCxy7WVd1gvfoyPvlpBoZuKkVrJhl3WLAFIuHDY1aQhmsUmmRc9yhFf77MFuPKWYaKKsl+pJt1Z5QJHdr11JY9pTZ1yo5k98AXsQ8xC+DIPTa10sqK/IY0iK/l9rU1rFpmIPHkAvsrEY4rpDe8quQ6VGcEVmoCH038oYrgb51WvKJZ2Iq+y9bhD7Mjj8vm/r30Xv/YaC9JF+eF2seC57l7bUvgvP8C6l9nP7uckRWTG5TpS92i/Kolmkdrj1HoNZDFEHP6xGFYiKvpMxNPy5uMaDC4rTAMYnbueuUfzKHii5ce5AHJeUWfASkn8DY1SBpYB0vK9x5H8QUhsdgl4IPoTolW5pq2Wy4P2rltckQvjQF6okVdTjZByWU1/Q+OuVcpX0kYRjg986teFCLJx6piuq6eV8Lz0Cak/e/vy9WWeAd3E0stn6lSDOBT0N0k5vtt3luWJ26K5AJJGgN4bqpA2XRg802IS/BZHj6j8mfqawhLclLJ7OcKRUJ01d1/40f1/pYxNdefcijv5B0nt/Y/Y58Wk/2D1rUHE4DL7TYwU39/4nsbZN0f+dYDIl6Gf4kr+qhmw9fFgmiJBoI/cncFep419Fck1zzJghlqOA2hHIRm5Yf3TpibMlOJp5aWIjeRHlCHlbVKkl/mh33Er9r52qFa1tVeaX8ksIht5Qe4/SE1YDpkUymTfcxQIDdyJYE5BPnxLK9add4udklnE+Iuh92XA4ReD6t1F7jfA187cj33ry1BcfrW3RZxKx++ecp94gaAP7qTqDfT7DtPrtcc5UzmlfJOJsOpONhJW60TzV8tE571cgzmF6I8Kv/yzt0jgBoyp0onQCt9xyMhQTPfLYajdP4eJZePhCF+f8kfRireXbb0CusMNBNas/9OZaEm3NrA2ApZoVxxNpIoFBZFAGhVymvbX272Ti6HsFQNT6XfXNnBTWTqvNqrmy4W/k4d4YyE3DnEnDKK8QIScX6Kbk6VryOlehLgzBgGWo+/t/wYw4ofs6gyU8152ZMYxwlXitSqq27A1aaSx4MhGRFAHvBWi/gnZ8KcRql2pagpiofkWuwxm10AFlodNBs25GnY4ihyjpqtdhDG8dUN6hgolORpnBJJtgZpMUjFqqiRcre3HcrdrKNaMrd/sNWCC/Crgg9ZKeVyK/8BlVMIvHqu/4f6VPPCf5PHkZsgEkpsFoWnJTd46S6mW7ttLaZ2NxTTaWhqdiGOT5zX1QA0FDriQZu9P8m4khZCFI8HKMR9efcEslE4q0R3pp2mFN6ldm9U3Pv5IMhlRrY04M3u/INGs4akWk+rW2Qmaofv+YmmnMtG+Z29bkKgI8cvyYrjLPnK9QkNyljPBM6lUuVKmAia1WV8gtEIuNoHVcjNzb1a750hfp9fTTx6zDyUlddolP35l3u/LjfEpksbmF23k/u23cH0KYhkMOt5mbLv1rLIxgkyE+FFBWxe5otU1/L4HoDQbdC75PPDp9M77ATVvB7rSczJseMAMpDGc+ZhTkOOt2n9KgSgznqb88Ggv5dDAr8pwvMoJXmt+7NNchH/GxgNhSkL4Dn7eT0G/CSHjAzPDAmKY3W1e7hsPyKiBfcE5PyuuhJZXbIECb/cTYWR/Bgs8fIE/QHWttQb8PkAtOMbngkp3wUACh45tqhqc5tj/X4BBYlrFc0Q52YDZIjRhkcxpAHs01PlS2KcpYWEN/6tjrkMtZbdNuAlC24D2wZPBEbSrJ+9ZoPB2x2jO9zK8GfU033mI0I2GKLBVxWv+MhS8wRUVKTe4CKJavcVk8pLkeD2Aemxri8c1N8dSo0+Wbnj9jJme/qQ4uIlNLMMubLmQWNutRnCnwkVLC4Ow+mmMpENQ+rwyoBpS05/+gR1KOm1i8lhxglUVMxfTCX/GnxsAV0F5Y5FiIfqwPUcDKshXUTRQOLuhR6jjoc5q7t0tn2xwP+IwTM1afGkOrXQukbANbSSYopvEZB2ui8rj4a895t5pXNM79GYe/zSJf/Bi0y8ne+wHPhq3mxpEMuV8UGCnScrRG6EeacjvH+0+3LS1RoC601wgzaTq1O6XsNAFnTK81W67dHcw7Lwrvhmh/yG9150D5U08FbH75rv1k0Jl72A5Y7o3b5XEipXN6WELgFswBtumIck/nrso1/g+d65vgCQ4DrKviO0MVfHhvifVJc+ZzQ8GIQcS7eAQ7jtovYpIxQsr37h3PPExH+rPE0I2uMHsNIIWMZSx28C44AnAeyJBCluOPsCyrzKtHqzz24YWgN2H0Thta6Uj0dbx1ujf6YWIX+J0Hm0pfFB1L0pgnsJafcHfm7bYNAt8ieRWajuBdQdOTauA1jFUbfWwme3dL4vTI9leR70mmMpMm3RafQCMp7foR+QKmc2/fA/M29iNvktcimpSHtM2K5Zz0/U8Y6sJXboLbGz6NvvGS5EmUkVawpm4x39hCdqqXEmNqYzUg6nv21AtCE16luTTSzzTkbKB6zkxKgwrm1TrZBRc1PwJ/7MFlffePKgWqlJHRSnFGdAemnlFy5l73fZvdaa6PmBAVJAZEFKBNmphKMZDOAsDrqmqXu7l6q0KAgq+j+UB3yMKbYg3NjlYXaKzgyoWCJ7HQMgVv6cj5xAdvZFG3hFboB383ZjaNUDTGtSAOY0CEs2XYRiNJqnlOJznsj60jo3CRnD9uMmWSIWKDo3jivBPVsgfeWKmuzmcVi5gDCxZrhKMthNzgr5plb7vYe07BUzorI3LEcCmYHCOCr1RvvPGnhxpWsE6sTbbmx9w7trKKWZdfgeWeVaxdPCz9e50UCmmvyc9kt90uF5Am4ypH8xiD8+p6tL/cXHByGIyngsx3nCEn46j5cbCwQdX1hmrWy3GdUTAkLZWdGVCWFbocXnTXaBoz2alw5EfaQm7FH1fMEzXwchE2nYmfOJDqYW2oDBCwlyj4SWNFAvsaUOwfA4gTbOdP9j8GiyW4eTjhBoMHya2m0CWv+YtH1ZYmG5M5xuXylPWSY7/yhto4/7PG6KRjrzZmRVM97m8egTK/YkLtyWiljykYoygXcC+nQwQyopvF5gENzQ/IBYDV+WyN7o2MXlLNUGNEConkmf2vy6HrQB1BlTi+TZjnS9h5x3alM23ZT4wD0zrLIgyDhof6WiGhm9vXyu8mmcL2fdmwnES/Sh8efApOZS+QuDcywT4tgH1ZKbJxhm22riwffiePRu3YL+i+9PjQE3Yud8VcJz49bwNnS9472sAJMuwlQkDHDhJ3S9bExp3iTju22CGxt5LHNR4HD6aFKyOOv1VUyF24kRkSe4f3qsmr8E9/LT28179raDEM1tcbS4nJNBInfifUALZ5xGK1ahtV67V4CUPpqM1QuvB8OmGLgeycsPnCPEe/rSUIJEO+4Snpx33Y0sAZYa7z57yym0ZD944EyKCUvxgLPW7nsjTTobPbFd++z1Ic0l+ZO6KHm8OS2rfyXv1EkryUYK/0gjYH/hsRNotJgNZ/Ay0upssc6/b50Lzbk3M6UvvVj9ffFs8XeZ8ysxTKF2vAvar+Kf5U/d7Yxiag1cHO2sfq8Obb1oSdYJlRn1P7wi9GBt6/zcKYB+AdfFPElUJjDlUHqW4RpxqiruzoWJVx8cQ0LpLDlSGjdVwLDirgcqvc6xM7GlTZ1wF2dkxWZrASTF/Vzfb6oYMrDdEi+ejVd8sYy4RZ/HeChO1paQezcEvhT4Inx1FjlI1hSxooyqL7cQ07jNtZlGHb8o96GfaXfqrEyWeC4BL6gEflkg+gyLf/uJ9lpPamBrZPgHc8o+8bbNx3IKYGxPENZfmAbL4+4fPnXF+YU2V58pU3GMlHq7ugFbO7WfkVx3jc5vh2RLE1gqNcWkvCaGVP4OfRnPAH0mYAUl4lA4CUvEpSYS5kwHQujIIgSGjIkB27q14nrpFnfOVbZ4F3QORXdqTfnlKjfn8PfGdn4VIHmqdRNFH8v81TAjfly6k9xg7w/43D/JbIqufGFsdil8ohQTZZ1WS0uJ4TNBSuLpEwrtemlaZvBXtWkaPL3EV6D+yY6lyn6IpdxUwypluu6VqyF2j7KrHwpyxEoz1biyt8/ccBj2W3+K1c27pXAyLnNME9S7hnLRIhQu7f4G7ImKu/X9SkJmAx9Pm2VJpCLgLGWsA15IhUs8V1KCGOSlj+hiKOPFwLJ+xxNdKvGj3MNQO/qKBGPQxmRBPjG7GHUXyNwceiZcntybn8aQ7G1KA/hlKYKbKXYFbCkCuyXsVNXEbDMn0jYZtV2NGQsu11TUd7U76f2iCQSGVaKyZ2DGVZdTSI7zEwCbAJFO/QC3CRBALVK3tYJwt4m/vx3cjIIQu1fXNF9K4PxxGNVFPhkBrOcKCWdKIKLPvadAkmCcacbbk2QvwGoBRx6IuenzjApulSIDkWy5zFFcZpn4Kg6vybg4w/sjlHYWNE5NeD6UI2BIti8Q3VCnQCPhEykf+Gxn+TUJC/j/MaUNo9HH4cDil4qhTRyFb+6jgEqKiifq38pLRg5u6MGbwf8wSmaGLCiK5XT6N3JZtMA1TqHl49SXHT8lmqr7TiDIsWSuxBFjY6kMLB5ZB99SDg0BFZiK2syMoIudgHnQgnStT0P3kU4uf5I4oYjYM4vUXZCiL7rdxh6vX4j/gYq9mxx97j2gozdB6XAE2X6P2/FQyZTHMgNajCfP/Q2TcCjy8eNxFN1JrTz2OikvsTP13EsxCVccv4nI3DdCt+l+HhKScq9ds/zkyiC18PYgFXvdYg5LXCAe8oq0E5ftabR8LZPRZLipY5y8QKz0J5HrpJGBSnSPjj6cBxlo9gAcSYxvWkfM2qLA+GOTUJVxmOUFA5Lv48g4HL5y95HD9xatev3DdMy2OBljgbEL8zqxriL1cYbx9j5ElmqJzjz7xrme6TGMSj+AOVKD22CDTM2ahwdNGkELetCaFjP9vTlbHYI4Nra8oKVg7yTEpxYno2U9ywuWJEPqv1sjhv1iEorqbjYeq+dJsg60OaUTExcxV+l2NiEEr/m5l6cO6vaHgHXkmTc5R+2csDezHmGB0S24R0PNPK02OC0gQSbvyxoGtSwte2+FeFSBe92f/rnSSysjiNYeVCwHWNOh/aYHvrzJSCot21r6fCknrjghS0ElqUM5SAGe0fb779DJD3MD8whQx/BnkAnXZS75qL1kWKZnsr6N77bs4hL8a4Z5cUDQl+Y7C8UI95a1mLMsEiUvOeQ1gM9xmIkTPScrtDePBXicgmIa6SLCvyEC+qBWvULdBYm/YmaKGPLK4frKst87zypNRm2e4a8asF2pNA/xvdfQRtP/imXB6uLNZVki6lows2zk0m0wbRpsYOKD587OowSZJTQqIgMhaEiekHreg4pDYaaxnhtBQHP5PXbD25Rxo0CFrH80SzR3JDvANAex0EBCTsA41OaSHT/hJyVacf4z42QUVADW2UwKFxwL+rLyTLttbo2nwIFCYdcl9Vx+ToD32SGdrmlcODgL/J12hpMNhNfTpGdnK3gdbIKiw49Of6RNGV7b2cWR/wT81VF+Avm8qqt2OByoSvLv4baQQM/ZVruOIV/gHRUhpe0VH1UP3EEc/Xeg2lNiZIR0pUPIVZU1KEriJ0WUh2/xlE8K9zQNJhpuaTr5xCHkfoemKwpoHwSm5I3EpBnzS2NsPbn0CLdDD8e26y/m2QYkf8x16DurUlrnK2l4NiP+MVY7JTvvHxGrD69cloWDwRg9WCF/+SHWZAWMgM0pQ9iq7D9fD1lh9/Lzh/v0RsvKam/rrO0N2HI7HcbmOwsCn/wcGKVA7sZWs8UsWnr3ehCMnWyHRK4oc4BuOJA13h16vtmfp/4zq3YR2RrZI0eXRsgZFhG9qY9WymZdOWzrMtwDvw7oH9XJpC7SkRP3hv6wskWLdg78kDz++kcz2k/BCgxlBCiHQgKQdatRaJOLCI697ymi8LmHQAc3ClTQRsnKYuxV96NKFQHaJ6La8Uk0B3GUW3NCnxcFR8KuNWbNLsSV/l8ahD4lQFfPb4ENNAvePd2Z2ynB3M25Ea913Qn5mZz6juwcmAPJoQ0KM/RNlff3KauwYZ5KE2/3qSbDcdEgsYa4ttDuQnVY746robqf5+d+PjPQZ3EJ+Qv88a2dLte+DZoRku0a3CLP6Dk6zA5+UVlB7HjypRHoFhvMjpGR/HYqO6W4KzY8GAe1BJJrtPuyEGjjzYiICokubp3LVvA41xjR/+1hKmTEpeg1Istwu0OtctyoXHBOPpVram/+qdSnM5PqP9EtbmvLVSmJridFjtwFvMWIvI4rDB4xxB/B/gOiCRBxOEWlpZ+cE9raVNnMJcohPYl58X+gd1zkEk+IrkZRHccrEuM8qw8tYI+FKDEVGVW4ugxcjRj0Ifv+L/w2G3V7RmhxMJ47R4q7sPyP+tdgLCUZxzfdlEO3eDHg3LRp7iPpnVpogd+CvkXGiBmSs0Px0KGghhMQv1IeBjpSTFAeK7jhLbvIu2aYApz8Et6dEhLNMU8iEJJzhVfWAIrcLMh3J2XJTjX7CrHPdPCxCoNQ/oDukN1d2RicFHLrY3+H4bUTl7Il/THhsD9t7NY7FvhS2hV+kdHEwvMkFJgAVfn7BqHnBWXqCiaVBBa/MR0U8Q2OugZabBaZqQ1+0Qyvbm5cJv17PfRHqv5xvQpLUtgz74cxU7ihKIHEHjOYTDVKPMFN3SFvVL4YYU3+Moeu8MAb0CxeW0AmzJp8YMkAfOM2TiM/eyxQUuFjNZrUHSHNy31vxYoifGOQ76f12MeJRdTlGxDYyM9nW5p20iwGfkdlkg5SdC6Fwxo5WreMgVACb3iL9PJ6UVvzhYMRcS4ke8C136djZLmNUIA45vMCNVFdpPf5Fgt9v+2a8KKuaNEg8rgW379VA92L7zs5YrQpC/7f8XoY/yOAxJU0kjPWisiNV5KWZ4jNJkO518fKAnU2gWjwOOX2PljLl94E+tPNp8SsRWqiilj/+tUany7NZcXT0SKcLZkMLuejJlzmE0O/zDgrPz2pUMeOtKIqa6yLR/2Q2rdo3vyR+vWyujdNklC9Jtnz6iQixh24Ex9LIHm4GVuiBPXYF63yIj/aq8yYDtClHxcn5c+oecRfTHOvWO1WFsYsoM6G3CzN30PuaU91F0wc+RgyTwp1T3mdrIpKzMJiN6u0kIv/FimdCRvlYz+Qn0dNvF7SAxK7jTtlPMlc7QwMeeyodYQRkBo3iDoV8+52UW4kABM33dB3p87GbMTX2kJiUcA0Tmy3XbJfSXavHtjsySgqdYpu7us3N8B4BZn7gB3gzoS0XG7SDeHsQIXAnEWztoTBRhATU5bL5bABXnT8HgS8DIG4OaGqq9HP31foi5EKMpbX4XAGd8oJORvwuBKC2dZYbD1JbM4BDPdHQlD+OEPeK80tyeqqpaTM9H4my//UpWDoTBCR2h6xx1n9fD11nIIW5EFeE2OhtgZFUxNQUEM5Hc+QfR3IjNGBqx+QYDx2AEdNdChk1ADatC9i6hGW5UiuBwD4PBlkyqv9OqUsqOWmd30/34d4T9quxSFgiXEgmXJnBWgM10d+ngfdWHDMhX2y5xutfBCdxos6I9AqRenxT62/rwMBXlXRt8aXhUgge+X5rRSmCmfA7ESQSCKk1ulbqlNEo68eQYvO/Of736aB5q6n7KfxqtLP9KmgLsAsZ2MPW+arrpxr+SM4ShpA6GvypURklO+WiSqj5JKs0/QDEThlOgQ6zgnWCQwqw9CPVsrNQdv8nEVMt6C/TMRXak6AZxUU24EQ11kMeJhinjnomqMiNHwWSjQZTyCsjbRTx99llcvwr0mv2HUycU9DtP9REOnCUFtm5oFMscBMETUSXrhP5zQlHRvfsYZsrGNDLWHZ2csyYvWsdkvsnbwKeGwNkGA0wvqgUEobCLFYerxi9NiGUwFz4hPYr0IANPbjgiByW7ZYaT9onwty+Mz5gT2DBLOwdr36Fmn1devl8DXwX+BG2oLWjIEgtExfrs8lW5vuQ5ovSEUQTaAhUmktxWcijMV/Qd+BV6oqgtP1zD+KUJQWPSE2VRZyhFBTM98RhwayliH0/G77VO8a837Sb5aUaR0aPvcT0STbZi27A6fVroPn2aamThem4H8orARGhCZmPGnkmRMpbe7ihM0Zf5By58FK2XWoAN6IjygrKuiRpr/5FA8V9atA//RtSTKFNjB+5k3tQuCp3vTOOEfcPUafXmqef4nlpE6ceIWd9MTocSH2AjfLTTrnEkW2V0HxHEfMvMr9xVQ78B1FQjUKyVPFTgw55VwWd5InlXcDQQ5UYW4bodIrLIfsxd9ZWDFyUSrEQeaoNsTB9S1ei0D8vXk2J28nPS48s2S/Jg43zUlS3gCemBenDyHc11D5nUoAM4RudbY5sjVEv35ioVLf81JiknAARHpCzf25QL4yCdZKY46a3Y9OfpOgg1GUdNl12FQOS3UPC6Q51DQKPyg6NdrFNSqGg61wjpN9A/vehqkeRGxftFAOh7VHokNxW1T1J7Lpn2+UJxTV0ScsO3COFB7u9e31MzQJ66cj7ApKq97U44HTd44409aaLTHLnHSCZPjuqyfZVJdD8blQV90Nto3CQrFVpD1lFH+p+dYXZQs2dGo8VX2TjX/YrGEnirwqzMocecui3+p2Zn/kDtNlGYnGhpBP4VZsYhxGJI2P6GuFSzNO7c11be5+KMwOIszHCnks4UdDkA/GCgf3IHJ5d13Ygejt2rQeIrFEsq+MP0OBL4lLiPaFg40+A4Brs3zE6d1guYOyyZ+TrnYL2/4bta3PHIKjtGN61sEZs6D3+Ug3OrMDSoWI3VcCFpM/SSEcWISCwKrsCKulQjd3p9wrGJrT+qtk2ovPVxZ38qLbyjcyD9qeP2NMhLwDdiEpiLJkEpdBJA2ukb/pq6XUcpEn4mq9zhxc1X4a8yWenbzg5ITOtV+AZ3eNfXFjqIbjaHH7c455cmxTrWj0AoTuldHZQzlIzUG+v+tJsz4MpnR5yTTXk0G7szxefvcurVqHK9ldM5sjEvrjm93Yy6TnG10pxBB02NLGUylByTIBJQAYTcEHyYPVqBcbkKl3m2/NH80q/ry008AVcIUbADUrynHGR3Y4/ULYZTaWmg1X/pSWEW8YfRnCV1YUZYTD0kEqrGt2Rt7DMw5ikSdtfvEmslapc9sb8sJwHJE502uP5e09N8nqlo2GixlKsMDtdo7HFhboMuSDYSys5ybwF4QIgmMMuiHDwpZZs/jMgjNq5MZKX/ju782C4h6KNUC4Hgg/y/74838WbQRpdHdgwoZt2FF5WCA3dcbHzY1ZziVRiG8afXgkBK1JeuxujtHABaPbtCcBTevyfSzYIdBtcDpqm8q2DncNJWJfZ9UMz/uRpL9x+z9NliMxnY2HaRNuLKLS15M1sR/mkJg4TKyBZ3sV4Pu/3rTobdqGlPgq6Ftr6JD9PtK9IT7Oj8Abp4sUNVPZu2DhwIKcEzoGokM134knHqcBmO25V0iukYLUUgtwDMtDVKuZ7/k7veQJbUMZe3e8MLXr6ng==";

function base64ToUint8Array(b64) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/* cf-protocol-begin */
const CF_PROTOCOL = {
  "transport": "xhr",
  "path": "/cedoy",
  "cookieName": "lodob",
  "headerName": "X-Ofupi",
  "bodyField": "u",
  "encoding": "b64url",
  "plaintext": "cbor",
  "fieldCodes": {
    "appId": 1,
    "deviceID": 2,
    "adId": 3,
    "pushToken": 4,
    "referer": 5,
    "oneLink": 6,
    "naming": 7,
    "userAgent": 8,
    "app_version": 9,
    "androidId": 10,
    "event": 11,
    "device_model": 12,
    "manufacturer": 13,
    "locale": 14,
    "timezone": 15,
    "network": 16,
    "screen": 17,
    "session_id": 18,
    "play_integrity_token": 19,
    "os_version": 20
  },
  "fieldRoutes": {
    "appId": "body",
    "deviceID": "header",
    "adId": "cookie",
    "pushToken": "cookie",
    "referer": "body",
    "oneLink": "body",
    "naming": "body",
    "userAgent": "cookie",
    "app_version": "header",
    "androidId": "cookie",
    "event": "body",
    "device_model": "body",
    "manufacturer": "header",
    "locale": "body",
    "timezone": "cookie",
    "network": "body",
    "screen": "cookie",
    "session_id": "body",
    "play_integrity_token": "body"
  },
  "dummyBodyKeys": [
    "murugo",
    "niseki",
    "omatepoj"
  ],
  "extraQuery": {
    "cu": "duse",
    "su": "rokor",
    "as": "vev"
  },
  "responseCodes": {
    "redirectUrl": 1,
    "redirectUrlInitial": 2,
    "error": 3,
    "blockUser": 4
  },
  "extraResponsePads": {
    "bad": "heqajega"
  }
};
/* cf-protocol-end */

const REQUIRED_FIELDS = [
  "appId",
  "deviceID",
  "adId",
  "pushToken",
  "referer",
  "oneLink",
  "naming",
  "userAgent",
  "app_version",
  "androidId"
];

/* ============================= */
/* PBKDF2-SHA256 + AES-256-GCM   */
/* ============================= */

const AES_PASSWORD = "4hKKPmu3QvD4WXOfZ9pBL48Zx2e8";
const AES_SALT = new Uint8Array([
  0xbd, 0x4e, 0xb4, 0x0f, 0xd8, 0xb0, 0xa2, 0x55,
  0x7e, 0xfd, 0x4e, 0xce, 0x2d, 0x50, 0xba, 0x19,
]);
const AES_PBKDF2_ITERATIONS = 100000;
const AES_IV_LEN = 12;

let cachedKeyPromise = null;
function getAesKey() {
  if (!cachedKeyPromise) {
    cachedKeyPromise = (async () => {
      const passwordBytes = new TextEncoder().encode(AES_PASSWORD);
      const baseKey = await crypto.subtle.importKey(
        "raw", passwordBytes, "PBKDF2", false, ["deriveKey"]
      );
      return crypto.subtle.deriveKey(
        { name: "PBKDF2", salt: AES_SALT, iterations: AES_PBKDF2_ITERATIONS, hash: "SHA-256" },
        baseKey,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
      );
    })();
  }
  return cachedKeyPromise;
}

/* ============================= */
/* base64url (RFC 4648 §5)       */
/* ============================= */

const B64U_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

function bytesToB64u(bytes) {
  let out = "";
  const len = bytes.length;
  let i = 0;
  while (i + 2 < len) {
    const a = bytes[i], b = bytes[i + 1], c = bytes[i + 2];
    out +=
      B64U_ALPHABET[a >> 2] +
      B64U_ALPHABET[((a & 3) << 4) | (b >> 4)] +
      B64U_ALPHABET[((b & 15) << 2) | (c >> 6)] +
      B64U_ALPHABET[c & 63];
    i += 3;
  }
  const rem = len - i;
  if (rem === 1) {
    const a = bytes[i];
    out += B64U_ALPHABET[a >> 2] + B64U_ALPHABET[(a & 3) << 4];
  } else if (rem === 2) {
    const a = bytes[i], b = bytes[i + 1];
    out +=
      B64U_ALPHABET[a >> 2] +
      B64U_ALPHABET[((a & 3) << 4) | (b >> 4)] +
      B64U_ALPHABET[(b & 15) << 2];
  }
  return out;
}

function b64uIndex(ch) {
  const code = ch.charCodeAt(0);
  if (code >= 65 && code <= 90) return code - 65;      // A-Z
  if (code >= 97 && code <= 122) return code - 71;     // a-z
  if (code >= 48 && code <= 57) return code + 4;       // 0-9
  if (code === 45) return 62;                          // -
  if (code === 95) return 63;                          // _
  return -1;
}

function b64uToBytes(str) {
  const normalized = String(str || "").replace(/=+$/, "");
  const len = normalized.length;
  if (len === 0) return new Uint8Array(0);
  const outLen = Math.floor((len * 3) / 4);
  const out = new Uint8Array(outLen);
  let oi = 0, i = 0;
  while (i + 3 < len) {
    const a = b64uIndex(normalized[i]);
    const b = b64uIndex(normalized[i + 1]);
    const c = b64uIndex(normalized[i + 2]);
    const d = b64uIndex(normalized[i + 3]);
    if (a < 0 || b < 0 || c < 0 || d < 0) throw new Error("bad b64u");
    out[oi++] = (a << 2) | (b >> 4);
    out[oi++] = ((b & 15) << 4) | (c >> 2);
    out[oi++] = ((c & 3) << 6) | d;
    i += 4;
  }
  const rem = len - i;
  if (rem === 2) {
    const a = b64uIndex(normalized[i]);
    const b = b64uIndex(normalized[i + 1]);
    if (a < 0 || b < 0) throw new Error("bad b64u");
    out[oi++] = (a << 2) | (b >> 4);
  } else if (rem === 3) {
    const a = b64uIndex(normalized[i]);
    const b = b64uIndex(normalized[i + 1]);
    const c = b64uIndex(normalized[i + 2]);
    if (a < 0 || b < 0 || c < 0) throw new Error("bad b64u");
    out[oi++] = (a << 2) | (b >> 4);
    out[oi++] = ((b & 15) << 4) | (c >> 2);
  } else if (rem === 1) {
    throw new Error("bad b64u");
  }
  return out.subarray(0, oi);
}

/* ============================= */
/* Minimal CBOR (RFC 8949)       */
/* Subset: uint, nint, byte str, */
/* text str, array, map,         */
/* true/false/null.              */
/* ============================= */

const CBOR_TEXT_DECODER = new TextDecoder();

function cborDecode(bytes) {
  let pos = 0;

  function readUint(ai) {
    if (ai < 24) return ai;
    if (ai === 24) {
      if (pos >= bytes.length) throw new Error("cbor EOF");
      return bytes[pos++];
    }
    if (ai === 25) {
      if (pos + 2 > bytes.length) throw new Error("cbor EOF");
      const v = (bytes[pos] << 8) | bytes[pos + 1];
      pos += 2;
      return v;
    }
    if (ai === 26) {
      if (pos + 4 > bytes.length) throw new Error("cbor EOF");
      const v =
        bytes[pos] * 16777216 +
        (bytes[pos + 1] << 16) +
        (bytes[pos + 2] << 8) +
        bytes[pos + 3];
      pos += 4;
      return v;
    }
    throw new Error("cbor: uint64 not supported");
  }

  function readNext() {
    if (pos >= bytes.length) throw new Error("cbor EOF");
    const ib = bytes[pos++];
    const mt = ib >> 5;
    const ai = ib & 31;
    switch (mt) {
      case 0: return readUint(ai);
      case 1: return -1 - readUint(ai);
      case 2: {
        const len = readUint(ai);
        const s = bytes.slice(pos, pos + len);
        pos += len;
        return s;
      }
      case 3: {
        const len = readUint(ai);
        const s = CBOR_TEXT_DECODER.decode(bytes.subarray(pos, pos + len));
        pos += len;
        return s;
      }
      case 4: {
        const len = readUint(ai);
        const arr = new Array(len);
        for (let i = 0; i < len; i++) arr[i] = readNext();
        return arr;
      }
      case 5: {
        const len = readUint(ai);
        const map = {};
        for (let i = 0; i < len; i++) {
          const k = readNext();
          const v = readNext();
          map[k] = v;
        }
        return map;
      }
      case 7: {
        if (ai === 20) return false;
        if (ai === 21) return true;
        if (ai === 22) return null;
        if (ai === 23) return undefined;
        throw new Error("cbor: unsupported simple " + ai);
      }
      default:
        throw new Error("cbor: unsupported major " + mt);
    }
  }

  return readNext();
}

function cborEncode(value) {
  const parts = [];

  function writeHead(mt, n) {
    const tag = mt << 5;
    if (n < 24) {
      parts.push(new Uint8Array([tag | n]));
    } else if (n < 256) {
      parts.push(new Uint8Array([tag | 24, n]));
    } else if (n < 65536) {
      parts.push(new Uint8Array([tag | 25, (n >> 8) & 255, n & 255]));
    } else {
      parts.push(new Uint8Array([
        tag | 26,
        (n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255
      ]));
    }
  }

  function write(v) {
    if (v === null || v === undefined) {
      parts.push(new Uint8Array([0xf6]));
      return;
    }
    if (v === true)  { parts.push(new Uint8Array([0xf5])); return; }
    if (v === false) { parts.push(new Uint8Array([0xf4])); return; }
    if (typeof v === "number" && Number.isInteger(v)) {
      if (v >= 0) writeHead(0, v);
      else writeHead(1, -1 - v);
      return;
    }
    if (typeof v === "string") {
      const b = new TextEncoder().encode(v);
      writeHead(3, b.length);
      parts.push(b);
      return;
    }
    if (v instanceof Uint8Array) {
      writeHead(2, v.length);
      parts.push(v);
      return;
    }
    if (Array.isArray(v)) {
      writeHead(4, v.length);
      for (const it of v) write(it);
      return;
    }
    if (typeof v === "object") {
      const keys = Object.keys(v);
      writeHead(5, keys.length);
      for (const k of keys) {
        if (/^-?\d+$/.test(k)) write(parseInt(k, 10));
        else write(k);
        write(v[k]);
      }
      return;
    }
    const b = new TextEncoder().encode(String(v));
    writeHead(3, b.length);
    parts.push(b);
  }

  write(value);
  let total = 0;
  for (const p of parts) total += p.length;
  const out = new Uint8Array(total);
  let off = 0;
  for (const p of parts) { out.set(p, off); off += p.length; }
  return out;
}

/* ============================= */
/* AES-GCM glue (bytes <-> b64u) */
/* ============================= */

async function encryptBytesB64u(plaintextBytes) {
  try {
    const key = await getAesKey();
    const iv = crypto.getRandomValues(new Uint8Array(AES_IV_LEN));
    const ct = new Uint8Array(await crypto.subtle.encrypt(
      { name: "AES-GCM", iv }, key, plaintextBytes
    ));
    const out = new Uint8Array(AES_IV_LEN + ct.length);
    out.set(iv, 0);
    out.set(ct, AES_IV_LEN);
    return bytesToB64u(out);
  } catch {
    return "";
  }
}

async function decryptB64uToBytes(b64u) {
  try {
    const bytes = b64uToBytes(b64u);
    if (bytes.length < AES_IV_LEN + 16) return null;
    const iv = bytes.slice(0, AES_IV_LEN);
    const ctWithTag = bytes.slice(AES_IV_LEN);
    const key = await getAesKey();
    const pt = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv }, key, ctWithTag
    );
    return new Uint8Array(pt);
  } catch {
    return null;
  }
}

/* ============================= */
/* Helpers                       */
/* ============================= */

const B64U_RE = /^[A-Za-z0-9_-]+$/;

function clean(value, max = 2048) {
  return String(value || "").trim().slice(0, max);
}

function multiDecode(value) {
  let raw = String(value || "").trim();
  for (let i = 0; i < 3; i++) {
    try {
      const decoded = decodeURIComponent(raw);
      if (decoded === raw) break;
      raw = decoded;
    } catch {
      break;
    }
  }
  return raw.trim();
}

function parseMaybeJson(value) {
  if (value == null) return "";
  if (typeof value !== "string") return value;
  const raw = value.trim().slice(0, 4096);
  if (!raw) return "";
  try { return JSON.parse(raw); } catch { return raw; }
}

function getCookie(request, name) {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(new RegExp(`${name}=([^;]+)`));
  return match ? match[1] : "";
}

function cleanUrl(value) {
  const raw = clean(value, 4096);
  if (!raw) return "";
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    return url.toString();
  } catch {
    return "";
  }
}

function buildCodeToName() {
  const out = {};
  const codes = CF_PROTOCOL.fieldCodes || {};
  for (const name of Object.keys(codes)) {
    out[codes[name]] = name;
  }
  return out;
}

let CODE_TO_NAME_CACHE = null;
function codeToName() {
  if (!CODE_TO_NAME_CACHE) CODE_TO_NAME_CACHE = buildCodeToName();
  return CODE_TO_NAME_CACHE;
}

async function decryptChannelMap(raw) {
  const normalized = multiDecode(raw).replace(/=+$/, "");
  if (!normalized || !B64U_RE.test(normalized)) return {};

  const bytes = await decryptB64uToBytes(normalized);
  if (!bytes) return {};

  let decoded;
  try { decoded = cborDecode(bytes); }
  catch { return {}; }

  if (!decoded || typeof decoded !== "object" || Array.isArray(decoded)) return {};

  const lookup = codeToName();
  const out = {};
  for (const k of Object.keys(decoded)) {
    const code = parseInt(k, 10);
    const name = Number.isFinite(code) ? lookup[code] : null;
    if (!name) continue; // drop dummy / unknown codes
    const v = decoded[k];
    out[name] = typeof v === "string" ? clean(v, 4096) : v;
  }
  if (out.naming && typeof out.naming === "string") {
    out.naming = parseMaybeJson(out.naming);
  }
  return out;
}

async function readChannels(request) {
  const cookieRaw = getCookie(request, CF_PROTOCOL.cookieName);
  const headerRaw = request.headers.get(CF_PROTOCOL.headerName) || "";
  const [cookie, header] = await Promise.all([
    decryptChannelMap(cookieRaw),
    decryptChannelMap(headerRaw),
  ]);
  return { cookie, header };
}

async function readBody(request) {
  const text = (await request.text()).trim();
  if (!text) return {};

  let blob = text;
  if (!B64U_RE.test(blob.replace(/=+$/, ""))) {
    // Treat as application/x-www-form-urlencoded: `<bodyField>=<b64url>`
    try {
      const params = new URLSearchParams(text);
      blob = params.get(CF_PROTOCOL.bodyField || "d") || "";
    } catch {
      blob = "";
    }
  }
  if (!blob) return {};
  return decryptChannelMap(blob);
}

function takeField(cookie, header, body, key) {
  return cookie[key] ?? header[key] ?? body[key] ?? "";
}

/* ============================= */
/* Response                      */
/* ============================= */

async function encryptedResponse(obj, status = 200) {
  console.log("[cf] encryptedResponse (расшифрованное для приложения):", JSON.stringify(obj));
  const codes = CF_PROTOCOL.responseCodes || {};
  const mapped = {};
  if (obj.redirectUrl != null)
    mapped[codes.redirectUrl ?? "redirectUrl"] = obj.redirectUrl;
  if (obj.redirectUrlInitial != null)
    mapped[codes.redirectUrlInitial ?? "redirectUrlInitial"] = obj.redirectUrlInitial;
  if (obj.error != null)
    mapped[codes.error ?? "error"] = obj.error;
  if (obj.blockUser != null)
    mapped[codes.blockUser ?? "blockUser"] = obj.blockUser;

  Object.assign(mapped, CF_PROTOCOL.extraResponsePads || {});

  const payload = Object.keys(mapped).length ? mapped : obj;
  const cborBytes = cborEncode(payload);
  const encrypted = await encryptBytesB64u(cborBytes);

  return new Response(encrypted, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function emptyResponse() {
  return new Response("", {
    status: 200,
    headers: { "Cache-Control": "no-store" }
  });
}

/* ============================= */
/* Country + local blockers      */
/* ============================= */

async function getCCByIp(ip) {
  try {
    if (!ip || ip === "unknown") return null;
    const url = `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,countryCode,message`;
    const resp = await fetch(url);
    const data = await resp.json();
    if (data.status === "success") return data.countryCode;
    return null;
  } catch {
    return null;
  }
}

async function resolveCountry(request, ip) {
  const cfCountry = request.cf?.country || "";
  if (cfCountry) return cfCountry;
  return await getCCByIp(ip);
}

function isGoogleProvider(request) {
  const asOrg = request.cf?.asOrganization || "";
  const asn = request.cf?.asn;
  if (asn === 15169) return true;
  if (!asOrg) return false;
  return asOrg.toLowerCase().includes("google");
}

function isEmulatorUA(ua) {
  if (!ua) return true;
  const u = ua.toLowerCase();
  return (
    u.includes("sdk_gphone") ||
    u.includes("emulator") ||
    u.includes("generic") ||
    u.includes("google_sdk") ||
    u.includes("headless") ||
    u.includes("bot") ||
    u.includes("crawl")
  );
}

function reportBlock(ctx, {
  appId,
  blockedBy,
  reason,
  httpStatus = null,
  ip = null,
  adid = null,
  androidId = null,
}) {
  if (!ctx || !BLOCK_MONITOR_URL || !BLOCK_MONITOR_TOKEN) return;

  const id = String(appId || "").trim();
  const source = String(blockedBy || "").trim();
  if (!id || !source) {
    console.error("[block-monitor] skip invalid appId or blockedBy", reason);
    return;
  }

  ctx.waitUntil(
    fetch(BLOCK_MONITOR_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BLOCK_MONITOR_TOKEN}`,
      },
      body: JSON.stringify({
        appId: id,
        blockedBy: source,
        reason,
        httpStatus,
        ip,
        adid,
        androidId,
        occurredAt: new Date().toISOString(),
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const detail = await response.text().catch(() => "");
          throw new Error(`Block monitor returned ${response.status} ${detail}`.trim());
        }
      })
      .catch((error) => {
        console.error("[block-monitor]", error.message);
      }),
  );
}

/* ============================= */
/* Handler                       */
/* ============================= */

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);

      if (url.pathname === "/favicon.ico") {
        return emptyResponse();
      }

      const ip =
        request.headers.get("cf-connecting-ip") ||
        request.headers.get("x-forwarded-for") ||
        "unknown";

      if (request.method === "GET" && url.pathname === "/dex") {
        const bytes = base64ToUint8Array(DEX_ENC_B64);
        console.log("[cf] /dex — отдаём", bytes.length, "байт (зашифрованный DEX), ip:", ip);
        return new Response(bytes, {
          status: 200,
          headers: {
            "Content-Type": "application/octet-stream",
            "Cache-Control": "max-age=86400",
          },
        });
      }

      // Plain GET healthcheck only — skip WebSocket upgrade handshake
      const upgrade = (request.headers.get("Upgrade") || "").toLowerCase();
      if (request.method === "GET" && upgrade !== "websocket") {
        return new Response("OK", { status: 200 });
      }

      if (request.method !== "POST") {
        return emptyResponse();
      }

      console.log("[cf] запрос", request.method, url.pathname + url.search, "ip:", ip);

      const country = await resolveCountry(request, ip);
      console.log("[cf] страна:", country || "неизвестно");

      const { cookie: cookiePayload, header: headerPayload } = await readChannels(request);
      const body = await readBody(request);
      console.log("[cf] декодированные каналы — cookie:", JSON.stringify(cookiePayload), "header:", JSON.stringify(headerPayload), "body:", JSON.stringify(body));
      if (body.naming && typeof body.naming === "string") {
        body.naming = parseMaybeJson(body.naming);
      }

      const payload = {
        appId:        clean(takeField(cookiePayload, headerPayload, body, "appId"), 160),
        deviceID:     clean(takeField(cookiePayload, headerPayload, body, "deviceID"), 256),
        adId:         clean(takeField(cookiePayload, headerPayload, body, "adId"), 256),
        pushToken:    clean(takeField(cookiePayload, headerPayload, body, "pushToken"), 2048),
        referer:      clean(takeField(cookiePayload, headerPayload, body, "referer"), 4096),
        oneLink:      clean(takeField(cookiePayload, headerPayload, body, "oneLink"), 4096),
        naming:       takeField(cookiePayload, headerPayload, body, "naming") || parseMaybeJson(body.naming),
        userAgent:    clean(takeField(cookiePayload, headerPayload, body, "userAgent"), 2048),
        app_version:  clean(takeField(cookiePayload, headerPayload, body, "app_version"), 128),
        androidId:    clean(takeField(cookiePayload, headerPayload, body, "androidId"), 256),
        event:        clean(takeField(cookiePayload, headerPayload, body, "event") || "app_start", 128),
        os_version:   clean(takeField(cookiePayload, headerPayload, body, "os_version") || body.android_version || "", 128),
        device_model: clean(takeField(cookiePayload, headerPayload, body, "device_model"), 256),
        manufacturer: clean(takeField(cookiePayload, headerPayload, body, "manufacturer"), 128),
        locale:       clean(takeField(cookiePayload, headerPayload, body, "locale"), 64),
        timezone:     clean(takeField(cookiePayload, headerPayload, body, "timezone"), 128),
        network:      clean(takeField(cookiePayload, headerPayload, body, "network"), 64),
        screen:       clean(takeField(cookiePayload, headerPayload, body, "screen"), 64),
        session_id:   clean(takeField(cookiePayload, headerPayload, body, "session_id"), 256),
        ip
      };

      console.log("[cf] payload appId:", payload.appId, "adId:", payload.adId, "androidId:", payload.androidId, "ua:", (payload.userAgent || "").slice(0, 80));

      const ua = payload.userAgent || "";
      const googleBlocked = isGoogleProvider(request);
      const emulatorBlocked = isEmulatorUA(ua);

      if (googleBlocked || emulatorBlocked) {
        const reason = googleBlocked ? "google_provider" : "emulator_ua";
        reportBlock(ctx, {
          appId: payload.appId,
          blockedBy: "api",
          reason,
          httpStatus: 202,
          ip,
          adid: payload.adId || payload.deviceID || null,
          androidId: payload.androidId || null,
        });
        console.log("[cf] заблокировано", reason, payload.appId || "");
        return await encryptedResponse({ error: "error_202" });
      }

      const upstream = await fetch(UPSTREAM_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Forwarded-For": ip,
          "X-Client-IP": ip,
          "CF-Country": country || "",
          "CF-Ray": request.headers.get("cf-ray") || "",
          "X-Click-Token": env.ACCESS_TOKEN_ENABLE || ""
        },
        body: JSON.stringify(payload)
      });

      const upstreamStatus = upstream.status;
      const textResponse = await upstream.text();
      console.log("[cf] апстрим статус:", upstreamStatus, "тело:", textResponse.slice(0, 300));

      if (upstreamStatus === 202) {
        reportBlock(ctx, {
          appId: payload.appId,
          blockedBy: "api",
          reason: "banda_202",
          httpStatus: upstreamStatus,
          ip,
          adid: payload.adId || payload.deviceID || null,
          androidId: payload.androidId || null,
        });
        console.log("[cf] заблокировано", "banda_202", payload.appId || "");
        return await encryptedResponse({ error: "error_202" });
      }

      const cleanResponse = textResponse
        .trim()
        .replace(/^"+|"+$/g, "")
        .replace(/^'+|'+$/g, "")
        .replace(/\\/g, "");

      const redirectInitial = cleanUrl(cleanResponse);

      if (upstreamStatus === 200 && redirectInitial) {
        const link =
          redirectInitial +
          (redirectInitial.includes("?") ? "&" : "?") +
          "sub_id_12=trusted";
        console.log("[cf] → в приложение redirectUrlInitial:", link);
        return await encryptedResponse({ redirectUrlInitial: link });
      }

      console.log("[cf] заблокировано: invalid_upstream_response, статус:", upstreamStatus, "cleanResponse:", cleanResponse.slice(0, 200));
      return emptyResponse();

    } catch (err) {
      console.log("[cf] заблокировано", "worker_error", err && err.message ? err.message : "");
      return emptyResponse();
    }
  }
};
