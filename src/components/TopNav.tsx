"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cartStore";
import { signIn as nextAuthSignIn } from "next-auth/react";

interface TopNavProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  onTriggerToast?: (message: string) => void;
}

interface SessionData {
  user: {
    id: string;
    role: string;
    phone?: string;
    email?: string;
    name?: string;
  };
}

const LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACMCAYAAAC9FwHKAAAxlUlEQVR4nO29eZxlV1nu/33X2vsMVdVzd9KZQyYgaaYkguJP01HCEL0IF6rBCFdFb7iCgnpxQNBKg6LXAbmiMsgVBAGtDj8CXEBE6G5IDARCIKRDhs7Y81Bz1Rn23ms99491TncHEtJJutND6smnU1X7nL33Wmu/e613eN53wXEKCQO454PPOPPODz/rHICREdyRbdXRj+N3gK66xAMs2730VSt2Dr0O4CouOX77O48fjhFw5DD3iufdNPOyn94uXZmLNGvM46FxXL4xGh32V4GK/zt8kbvfP715h50094E7L+t/doSbd1TjuBQI1oGB+Fzn9Y1duYt7DX1d/8MMse5IN24ejys0ghPY3JaXntp+3uWzk8tfEKdPfGFor76smLnux1YJTMPzs8RD4bibITZsuMQZiL8rf6OxLRukkQdr5LGxtZG7Ty7+LQMd6TYezTiuBEIjuNUbNwZpeKXdHF87s6eQ1czLOz83HZV9172itf3yM1i3Lmpk5Ljq+6HC8TUoFwybgdp/GN7a/J5fVGYWiGaKWKhZyG4Lg+Ef4lsMxAW3zlscD4LjRiBGh4e9rVkXNPaqVe669pWTe7sxuOhDGXDOcDXvZyZjrF3rf6l71yufbmvWhdF5XeIHcNwIxPAwkEP7HbN/nW1SXi1wynxmCGIVkczc4rrcd0JevX/uXeS9c+bxABwXArF+5JLM1qwLrY9fcUXzq+F5E51QGXjD4TKPOYdixMz8dFGGxhc6l7Y/suZXbc26sH7kkuxIt/9owjEvEBoZcavXbozS61Zm13TeNXVLKzLoncOBhGIEQ2ZGrAK1hQ2bub2IcXT2L9t67Zmr124M8wrmfhwHA7HBWUbsvHP2Pf6L7RXFUCbvvMMMMzADYjTnnJzPMJc5WzoQG18tF9mbJz5gNRNsOA7G4dDgmB4IrR/JbO3GqvPJ176xcXXrJZOtUGX13DvnMJe6ZmYyKcayMiz5ILJ63bfwVf3znZ9uffQX32RrN1ZaPzK/dHAMB3s0mqyK1tbffW7tjVu/MvvZ3cQVdWd4AJMChugWc1jdWFBbJHAGSbtQDHJ7WiH/yQWu/acnXbZg1d9+uX/NI923I4ljcobQyIhjzboovWNZ7T17Ptr90rirFnsIMjNwDjlPbFamsHTqu7Mn7/psM0IIVcBAUbJgFpY0XGfDlOX/e9e/tPWWJ9madUF6YusTx1zne8QXh0T5gc0f9aPTZ3brLtQHBpzPMuEMSWbRxfpgtIFndv7x1F8s/zAMzpqvDIUAQWCG8965lQti7bPtFfbWzVdv08gAtp9c80TEMScQbBjxtnZt1fq//+3P83/uvGB6rFX6gdwTMfMOhYBlJh+dn10+MVt75Z7R+m9svmnutKlbm5lzzhEwsNzLnMN571tOZf2T3QuXvv/efzC3NvbJNU9EHFMCodFhb5eurVqbfmHNwCf1pumv761YXMscjqggc44sy8yChcFaYe6pkx8bfOnYdgK4Z82+h8VtsyqTMzPoCZBM+ZLBvDsRysZGXTH3lVf9WlIyn5j+iWNGIPp6w2T7l8/KP84Hup+diqzInUI0coeZWShLs8xkXbn2yunSv3z3u0b+CKeRETf0J7d9uHve2M7MOY9XVFEROiUqK4vtilCTL78+Her/xjtnx1/6DLt0YzX6BCTTHBMCITAuuNUsQwOfmPs/2TXVgtIr+mbd+TxDRYXznizPiN0yDDWji88c/1TjxePfW7uWaGvfFs2Yjs8fe7dfMWeURIi4RgbeIHNkS4ZcacJ/pt2oj2YfukPn1Id54ukTx4RAMDrsbM260L7pstflX/arZ3a1KhvMstApMZkMQ1WQYpBrO+ueu6cafNOOtytiuva0s9tfXXGWwJq/Ur63ePruPXlwzjKLFpX8FAaxU2FZ5ue2z5XZDc1nnvbFc95qa9YF1g0fG2N0iHDUd1YjOIZH4x6ddnJ++xl/XGysoq2sO5/XcOYou4XFEIiKOFkYHCp98aNjH7NzJ282EMtmX91YHn7RQGZbx+1Fu97hz5xxzmVRMYJAGCoqzBlu5WAWd1iobV72P6fufu6Tk3n7xDFFj/6OXjBsZqaF61f9vv//w5LW+HR0pSxWQThHXstkmcMsKCvkZp65a3LB2rG3Kvam+qJ8Sazs5Ug2MoLL/+uWv51+9j031VyZuVoWLDMjRnDJjenMWbVjVu6WWrP+rcHfNRDrnjjciaNaICTM1qwLM1p1ov177RenP7FNoYnvTsyZymAmcN6bNxldH3XSuPMvn/hDs4ktCNQ9/UKaQ093NTtf7af96FVXITOrsjdtfd3cOfcGX3jhJaJw9RwTqBOI7ejDt1rRfafxivHtTz3D1qwLeoIk+RzdndyQ/AHZhmX/Nd9YLCzrFmp5zbJ6TZghIiEGnHNVlnWyqR/buWHginv+Tu+7KDdDTDV+naHCGGgTZ3mTGdLoU2uDK9tfa79k+//SgvsyX2XBcgfOMO8QoDJS7WmH/LYFg9lXTrgCgNVPjCSfo7uTl66OeKi+xEvCPYiGkJD3mZkZVVmKWMZqrrSp87fPnvCX7Ssx4MqfDdp5wlmRha9kcioyMxudH/85zZ5+ob3i1kJXXpQvf82eq8Z+4r7vFGEq88SgsgRAIRBjJBAcm7riW7xsRDgu3fCEiHEctQIhYcbaOFU9ZRm3h2fPTlUmh1MQZVmqLEv5WoaPeewu3uP9z+15qzW23Xnn515YM1sbY3bBnzg/26QbIhWiM+tpNf4KwaY3tM2Mcunvd//7xDn3VN1WCU6SScq8ZFAWwbX3dszuZNUbWXmaYXoiLBtHbQfX9cy9fHPzvGyPW1wYMSILsbIYKkJVminEue5kNnvhzutXvG7339wycn7tvMv/ras9J652zfBKdt8RqDuPd47J6cCCuFrjZ7561apbizs+d069dvLYN/IXTvx9a9FuH0II3bmWVZ0O3aJrQnRDFfyOWPf/vvB8AC4YPu6Vy6NWIIY37TaAsCWc7mcMZRYlEZEqBcyhohNsbOW2asUvz/6mGeqc3JTW0yC/8N1M3QYhAjKcAc7i2IxgyZ/rFpaeO/usanQYf8IbuldNPnXHzu7krM+9RQPzMsqyxOpOTHqKm+0MAHptOp5x1ApEH2GzlofZSFBa2yXhvMMqQhWnnH/O7EcHLxu/QaPDtYtfe2MZz3/eH1CfXsXe3RUu84pAiIY356YnA7WxlZyw8vdszbrwzF8+JzObmlhyWfevi+UTFkvFGIPkEIIQKqp2pDvWXXGkx+HxwlEvEJqKA0VRESwoSnTLgrIs6HZKv+dJY+U5b575cwlj0/mV7ll0JubfxD03Rpw5iFgvWk4M4JxnMo8xhN/QvfUnnfuizYVGcMtfM/ePkxeMjXdDkXmkGAKYJQGMFdEVR/04HSoc9R0t63OTZRaJiiYJM8OJUDBnndMnr7VzZm+98cqLMlu7NuIW/rar7WxSdCJmjgiYIScwDwpGORtdVDNOVG80Q3cuJTeb3eufNv3pKpsglDFWCiZEqALdWklslntTazYe0bF4PHD0CsQFGwXgz+5sbTc7lFWwQiXpQYFfWrBsVfVpKuwz7//ZoFtZFqbtVezdIsARJGIU5rBsAGIUsYJqylEitewV2sOCc8cpBXbCc7LPV0s7dNsFMUZVsYKITQ118KfO3ZvadPznhR69ArEpDf7SyydvnVrQ6kj4oEgkEkJ0nSVdnfCjXA9oLWtjd7u/1JfVErrTEecM74xsCPI6ap4MtcXgMlHIiEX0i9zK6o76c20t0UCLLtPNcVmoOkXlS5VIgW6o/MTgXOfUn2vdcmCbjmcctQJha9OED50tdlr7ducDuXMxxKCqqlwxULQHnt/e1v9+OZ49hzgusiicgxCkxiJTfhoWIjROM2qLTTEaZUf4qNbO6sf233Fspw0VE97MQgiqqioUvis7ffomv5L7BNZr03GNo1YgANaP4M2I9pSpz9iyLlREOVHFAI4SXNn/bqcbziCrjCKibmVUDuvslJXbIBuC0AEJfANcEwjWmo1P6p1uQNc3s3aIEXzSQecWzNjiJ3evjgVsGOEJQZY5qgViNemNfNIV9qGJ0ya6ZTd6TGlFKM2D9rW/KGOdXjibysC8ETKjBCa+jVrjqIjQKaHdggjdGdV6pwtoBGcDnVARVGmuCm7ySZMT5/xPfQRg9VXMu66PNGwtcXQY33zy9F35j0x+2C8qnQ8utGIpzTHItfnJ/e/60k3SFfsemwRlBVUXKoe1prC5iTRTVCUUopq0uf13O+nEalxLurHCBR/K5TNu2U/OvtMWzu7RMN7s+Ncf4CgXCIDh89GIcE/768k/nHj69l1lEbNazYraRG4zXx98dr+yXAjcTmHCkFUS7UqQiSKS7AiRJhyf3BIzjqrjN0GPondt9vT6zqav574zU3Vr1UVjN67649m/0AiO0eNfd+jjqBcIW0u8YBQzY9ei4bFfnHjSTvPRGTM1Td3pX2xZenOHlvLlqd1mZHjMIDcooxEddAVlABmqJDzu/juoFnj3eUiuij1f4pXl/RZnVdXbz9ox/iO/O/3zZnT7nx/JMXg8cdQLBMCaNYT1I2TnXtn9wtDlY79enDlW6043zG9urtbE4AUCW/iK6obpXbqOiKOhoBIjROh0wTvAoZZwtVhpDjdxl75wytriNgDFpefXv73whdN7zBXP2jO78qVTL7MfK+7UMP6JYFkcs1h/CRnAbW8d+NWbnnFWZ2z5xRp7y2mfJEvT/uRH84u2vteXugXpJit1rUV9hRg3mnSdRd1EoVvQHf/LzW0b4SkCowbTb3vqF8ZOfpZueM7Jm+97d3YxgIafGFbFMY/R3oPa8bHsObeuPu2G1k88RVPvO/EN/c+3vK328q3vdC3dZNKtSJuIuhnpFqQb0JZ3ur13vJnLAHDQ+Ydz/mbq0nP07ecv/9DM9ZwIT2xhOCbDuRrG2zqCRL5jzQm/0lhm/z1/dvv3h+6b/pKtJW55W/6MSDViS3leNsACAbTZFXbx+Xqo/fGJf9K9a3QYf/mrF18Rv1y/YvLu7p+e/rnJr1AlgVuz7olhYh5XOJC9JOHH3r7kNHjg233/aznlzl/iws2vyVfpjSzuHx8dxkvYtpGh5fuuAe6JlpRz3EFgfb3iAcdHcA9Gdxsdxn//cY3gRp/AS8T34wFvhHRsWB0Pgn4/9puH6zBWYNyB3QhcdCXxAZ/vP+9YNin1RDKJ53EE8IAZonM3T3YnDgwpI9RqQHHAh8nrr2IOq+WIsjRyKMp8/3fyfV9VUWI1EDlQAnktXaM44Mu1Wvq71j/5gGuRW3Iv5r3f+5+ZIDOoBAeef0ADHtDuav8bVHQNalDLIdVIT58VSuNQM4EM6tp/ofKAi/Uv3O3d/8D2AlQqkNX2dRoKCmpY77gJ5pT607snpYrkRTtgmFNf9p9TWEFhNWpKP0sVxWw2t7V119KzmbJU5OSQIK2/ziCKzo3PWrfoaTueFsfGoFlLJFWn/ZOqKY1Zv7yboKYqnU/vOECM1JyBuXS+M6Cb/ib2zi+Bdvrdud6z8UlEjfQ7SudY7/PYK13u6H2W9SZ9A4v7FwCzFPdSSMc5YPwTsy4ds9A7t3/8+3XK3iqj3nWJvfb3f3fpOlHpV0FN6l07yVaNmMaDftv649QfM1Hb5/rq9UMArief6cSaBPLUqggqVSsqu//Tfg2EdV/+I7JL11I9WiE4ED2FLHVi9u4xW5TtVjUeo2WlwzBXQ4oHtN8DDsMhM1CJWU6/0E//Uvvg/P6/Y/9v0hjiwDxmhvCkwJQDeczUu6b3aUJwWQpU9Qff9R8kKNWWElnWE64MQhtczbAgcCYzLPZOjkVPOH0qTiYJ74yyUi/BE6Ih58yIIkaoQK7Xrn47ez0zkFyvlyWY6z1Gh1nZ60c/lALW09T6No0p7pur1Ld0zCWZtqp3btUTyQpcg9Cdxu++Jc8gwIbHKgb7kQGWOMYQspajGc2aQA3MI4X+2O17gOB6nQlgjd7D7KmjzvUedl8o+i/Dgeqruxp5epO07AnnVn22f7zz/w4/tLzHhG/0E0mY5V4ZppnN+j9wDqE2XUts0PvnNez+yv6P9rK2P45Ftm9J4bQcWwZlhV0I010M+6dJjXJ9yB/V+n/eP3dDauOQ3uOfd1+XscdK+mK62N/W2eN9YwT3/9F85O++tXfPEn/VvTqRtzU/iG+3kM17I6Z2/ZcOfZ4tPnvM+2u3Jbe/f4vT7311yU1a/FbsHwF5lQjFf5H2P3wD2g8/5K0/hF5d/D/b4/0/V6p+N7z/z2TupV9GdbZ+t6hG3pP1MtrhN3X172y8u/VlU9D15/55/tXjDk9aNuO0jN/9Z/OId1xS6Z9/963bL2fG6cO2d1z++Nf6s/yLsnK3N96J38O3O3N0+0T35G1Z94Rz6vOz8XjX2Kdb27pPL+uKNuLz18dJ4pYpxvbeNuG3d0Kx/3P781vO/YevFq0/h52tE8K534rZt9N47O5+v++f3x4s7P8K+9T3sWz7Ivva9bNs+yr72/Wzbfs2+9v3sWz/GvvXj7FvfZ9/6cfatH2ff+qV965f2rR9n3/qVfetH2bf+VfZZ9l2c//VbPrZ2eX2XvG6rTq2wHq2zGk05X/fN5/fPfX6H+y/wz+/G7fvPq1//5f+X+7t+0YtWvGj/B1e/vLxP/Pvf3/ULe0/m3X93vV2W7G6b8YQjG03+0L4+nQ/2j8Tpe+7pPvldv2j/T5y+52/H7Xu+2T75nb9o/w32yY/+X/v32yd27Lh9/wf45HeTdux4z2//Q5w7Z/XP7/sfnj07n29O/iX2rO+RffV9bFk/zB33fYfL+sPde+e/yB+b/pKt9y/FfKCKx1jN+2v3DffYc9n34PfZd/299vPefoN997+Pfaer7Lvv43vew926eMtr+c3pT6PtG0h9h1rL6VdfvNbe8f/xGq5a2Wbv+e/sWw+x73QV/+hNf3x8Fw0e9G6a3O1Nf3yw/fH/8Rre2t7sHrsoXHlRuvL3c+nK38+lP/n9XDq/e/3m9/Hmv+D2f/T+rTctOPEhPrjtw9x4j7PjxDfy1vdzp/wCf/P/21eWnyPfX36OfH/5e/jN6U+j7BtIfYda/8T/B8bL/6s=";

const DD: Record<string, string> = {
  rg: `<div class="dd-in">
    <div>
      <div class="col-h">START HERE</div>
      <a href="/ritual-guides" class="dl lead"><b>Beginner's Guides</b><small>No tags, no citations, no Sanskrit to look up</small></a>
      <a href="/ritual-guides" class="dl"><b>What Is a Vrat</b></a>
      <a href="/ritual-guides" class="dl"><b>Your First Puja at Home</b></a>
      <a href="/ritual-guides" class="dl"><b>The Seven Kandas</b></a>
    </div>
    <div>
      <div class="col-h">BY OCCASION</div>
      <a href="/ritual-guides" class="dl"><b>Festive Pujans</b><small>Fixed to a tithi — 18 guides</small></a>
      <a href="/ritual-guides" class="dl"><b>All-Year Pujans</b><small>Recurring observances — 9 guides</small></a>
      <a href="/ritual-guides" class="dl" style="color:var(--pink);font-weight:700">All Ritual Guides ›</a>
    </div>
    <div>
      <div class="col-h">COMING UP</div>
      <a href="/ritual-guides" class="dl"><b><span class="dot" style="background:#3E8B4A; display: inline-block; width: 6px; height: 6px; border-radius: 50%; margin-right: 7px;"></span>Hartalika Teej</b><small>13 September<span class="when" style="font-size:11px;color:var(--amber);font-weight:700;margin-left:6px">IN 6 DAYS</span></small></a>
      <a href="/ritual-guides" class="dl"><b><span class="dot" style="background:#B5651D; display: inline-block; width: 6px; height: 6px; border-radius: 50%; margin-right: 7px;"></span>Ganesh Chaturthi</b><small>14 September<span class="when" style="font-size:11px;color:var(--amber);font-weight:700;margin-left:6px">IN 7 DAYS</span></small></a>
      <a href="/ritual-guides" class="dl"><b><span class="dot" style="background:#A83358; display: inline-block; width: 6px; height: 6px; border-radius: 50%; margin-right: 7px;"></span>Sharad Navratri</b><small>11 October</small></a>
    </div>
    <div class="feat">
      <div class="feat-l" style="color: #E3B567; font-size:9.5px;font-weight:700;letter-spacing:.6px;margin-bottom:9px">HOW WE DECIDE WHAT IS TRUE</div>
      <div class="feat-t" style="font-size:16px;font-weight:700;line-height:1.32;margin-bottom:7px;color:#fff">Every claim tagged and scored</div>
      <p class="feat-s" style="font-size:12.5px;line-height:1.7;color:#A99070;margin-bottom:13px">Dharma, Pratha or Bhranti — with a confidence score you can check against a named text.</p>
      <a href="/ritual-guides" class="feat-b" style="border:none;border-radius:10px;padding:11px;font-size:13px;font-weight:700;background:var(--pink);color:#fff;width:100%;text-align:center;display:block">Our editorial method ›</a>
    </div>
  </div>
  <div class="dd-foot"><span><b>34</b> guides live · <b>21</b> more by December</span><a href="/ritual-guides">Browse all ›</a></div>`,

  pa: `<div class="dd-in">
    <div>
      <div class="col-h">RIGHT NOW</div>
      <div class="live-now" style="display:flex;align-items:flex-start;gap:9px;background:var(--data-bg);border:1px solid var(--data-bd);border-radius:11px;padding:12px 14px;margin-bottom:10px">
        <span class="ln-d" style="width:7px;height:7px;border-radius:50%;background:#3FBF6A;box-shadow:0 0 0 3px rgba(63,191,106,.2);flex-shrink:0;margin-top:4px"></span>
        <span>
          <span class="ln-t" style="display:block;font-size:9.5px;font-weight:700;color:var(--data-tx);letter-spacing:.5px">TODAY · DELHI-NCR</span>
          <span class="ln-v" style="display:block;font-size:13.5px;font-weight:700;color:var(--data-tx);margin-top:2px">Bhadrapada Krishna Ekadashi</span>
        </span>
      </div>
      <a href="/panchang" class="dl"><b>Today's Panchang</b><small>Tithi, nakshatra, sunrise, Rahu Kaal</small></a>
      <a href="/panchang" class="dl" style="color:var(--pink);font-weight:700">Change city ›</a>
    </div>
    <div>
      <div class="col-h">CALENDARS</div>
      <a href="/panchang" class="dl"><b>Vrat Calendar</b><small>142 dates this year</small></a>
      <a href="/panchang" class="dl"><b>Festival Calendar</b><small>Month by month</small></a>
      <a href="/panchang/eclipse" class="dl"><b>Eclipses</b><small>Visibility decides everything</small></a>
    </div>
    <div>
      <div class="col-h">UNDERSTAND IT</div>
      <a href="/panchang" class="dl"><b>How to Read a Panchang</b><small>Five limbs, explained once</small></a>
      <a href="/panchang" class="dl"><b>Why dates differ by city</b></a>
      <a href="/panchang" class="dl"><b>Purnimanta vs Amanta</b></a>
    </div>
    <div class="feat data" style="background:var(--data-bg);border:1px solid var(--data-bd);">
      <div class="feat-l" style="color:var(--data-tx);font-size:9.5px;font-weight:700;letter-spacing:.6px;margin-bottom:9px">FREE DOWNLOAD</div>
      <div class="feat-t" style="color:var(--dark);font-size:16px;font-weight:700;line-height:1.32;margin-bottom:7px;">The full 2026 calendar</div>
      <p class="feat-s" style="color:var(--sub-text);font-size:12.5px;line-height:1.7;margin-bottom:13px">Every tithi, vrat and festival date, computed for your city. One PDF.</p>
      <a href="/api/panchang/calendar-pdf" target="_blank" class="feat-b" style="background:var(--data-tx);border:none;border-radius:10px;padding:11px;font-size:13px;font-weight:700;color:#fff;width:100%;text-align:center;display:block">Download ›</a>
    </div>
  </div>
  <div class="dd-foot"><span>Computed for <b>New Delhi</b> · Purnimanta · verified manually</span><a href="/panchang">All Panchang ›</a></div>`,

  dc: `<div class="dd-in">
    <div>
      <div class="col-h">START HERE</div>
      <a href="/dharmic-concepts/bilva" class="dl lead"><b>Why is bilva dear to Mahadev?</b><small>The leaf, the story, the offering rules</small></a>
      <a href="/dharmic-concepts" class="dl"><b>Three Stories, One Thread</b><small>Wife, friend, devotee — not siblings</small></a>
    </div>
    <div>
      <div class="col-h">BY TYPE</div>
      <a href="/dharmic-concepts" class="dl"><b>Materials</b><small>Objects and what they mean</small></a>
      <a href="/dharmic-concepts" class="dl"><b>Meanings &amp; Practices</b><small>Acts and ideas behind the ritual</small></a>
      <a href="/dharmic-concepts" class="dl" style="color:var(--pink);font-weight:700">All Concepts ›</a>
    </div>
    <div>
      <div class="col-h">IN THE SERIES</div>
      <a href="/dharmic-concepts/bilva" class="dl"><b>Bilva<span class="pill live" style="font-size:9px;font-weight:700;letter-spacing:.4px;border-radius:4px;padding:2px 7px;margin-left:7px;background:var(--d-bg);color:var(--d-tx);border:1px solid var(--d-bd)">LIVE</span></b></a>
      <a href="/dharmic-concepts" class="dl"><b>Tulsi<span class="pill soon" style="font-size:9px;font-weight:700;letter-spacing:.4px;border-radius:4px;padding:2px 7px;margin-left:7px;background:var(--b-bg);color:var(--b-tx);border:1px solid var(--b-bd)">SOON</span></b></a>
      <a href="/dharmic-concepts" class="dl"><b>Durva<span class="pill soon" style="font-size:9px;font-weight:700;letter-spacing:.4px;border-radius:4px;padding:2px 7px;margin-left:7px;background:var(--b-bg);color:var(--b-tx);border:1px solid var(--b-bd)">SOON</span></b></a>
    </div>
    <div class="feat amber" style="background:var(--p-bg);border:1px solid var(--p-bd)">
      <div class="feat-l" style="color:var(--p-tx);font-size:9.5px;font-weight:700;letter-spacing:.6px;margin-bottom:9px">LOOK UP ANY TERM</div>
      <div class="feat-t" style="color:var(--dark);font-size:16px;font-weight:700;line-height:1.32;margin-bottom:7px;">The Glossary</div>
      <p class="feat-s" style="color:var(--sub-text);font-size:12.5px;line-height:1.7;margin-bottom:13px">142 words defined once, in plain language, with the Devanagari and how to say it.</p>
      <a href="/dharmic-concepts" class="feat-b" style="border:none;border-radius:10px;padding:11px;font-size:13px;font-weight:700;background:var(--pink);color:#fff;width:100%;text-align:center;display:block">Open the glossary ›</a>
    </div>
  </div>
  <div class="dd-foot"><span>Paragraph only. No tables. Every concept sourced to a named text.</span><a href="/dharmic-concepts">Our editorial method ›</a></div>`,

  rk: `<div class="dd-in">
    <div>
      <div class="col-h">SHOP BY</div>
      <a href="/ritual-kits" class="dl"><b>By festival</b><small>Dated kits, with a cut-off</small></a>
      <a href="/ritual-kits" class="dl"><b>By deity</b><small>All-year kits</small></a>
      <a href="/ritual-kits" class="dl"><b>Gyan Patrikas</b><small>Knowledge booklets</small></a>
    </div>
    <div>
      <div class="col-h">OPEN FOR PRE-BOOKING</div>
      <a href="/ritual-kits" class="dl"><b>Ganesh Sthapana Kit</b><small>₹1,650 <span class="when" style="font-size:11px;color:var(--amber);font-weight:700;margin-left:6px">ORDER BY 10 SEP</span></small></a>
      <a href="/ritual-kits" class="dl"><b>Hartalika Teej Kit</b><small>₹950 <span class="when" style="font-size:11px;color:var(--amber);font-weight:700;margin-left:6px">ORDER BY 9 SEP</span></small></a>
      <a href="/ritual-kits" class="dl"><b>Shakti Kit</b><small>₹1,751 · Navratri</small></a>
    </div>
    <div>
      <div class="col-h">BEFORE YOU BUY</div>
      <a href="/ritual-kits" class="dl"><b>What is in a kit</b></a>
      <a href="/ritual-kits" class="dl"><b>Delivery and cut-offs</b></a>
      <a href="/ritual-kits" class="dl"><b>Cancellations and refunds</b></a>
    </div>
    <div class="feat amber" style="background:var(--p-bg);border:1px solid var(--p-bd)">
      <div class="feat-l" style="color:var(--p-tx);font-size:9.5px;font-weight:700;letter-spacing:.6px;margin-bottom:9px">WORTH SAYING PLAINLY</div>
      <div class="feat-t" style="color:var(--dark);font-size:16px;font-weight:700;line-height:1.32;margin-bottom:7px;">You do not need a kit</div>
      <p class="feat-s" style="color:var(--sub-text);font-size:12.5px;line-height:1.7;margin-bottom:13px">Every samagri list is free and complete. A kit saves you a morning in the market. It does not make the puja more valid.</p>
      <a href="/ritual-guides" class="feat-b" style="border:none;border-radius:10px;padding:11px;font-size:13px;font-weight:700;background:var(--pink);color:#fff;width:100%;text-align:center;display:block">Read a guide instead ›</a>
    </div>
  </div>
  <div class="dd-foot"><span>Dated kits are prepaid, no COD · free cancellation until dispatch</span><a href="/ritual-kits">All kits ›</a></div>`
};

export default function TopNav({ onTabChange, onTriggerToast }: TopNavProps) {
  const router = useRouter();
  const [activeDd, setActiveDd] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAcctOpen, setIsAcctOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);

  const [session, setSession] = useState<SessionData | null>(null);
  const { items, fetchCart } = useCartStore();

  const [announcement, setAnnouncement] = useState<string>("Dharma does not demand fear. It demands devotion.");

  // Fetch session on load
  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch("/api/auth/session");
        const data = await response.json();
        if (data?.session) {
          setSession(data.session);
        }
      } catch (err) {
        console.error("Session fetch failed:", err);
      }
    }
    fetchSession();
    fetchCart();
  }, [fetchCart]);

  // Fetch announcements
  useEffect(() => {
    async function fetchAnnouncement() {
      try {
        const res = await fetch("/api/public/announcements");
        if (res.ok) {
          const data = await res.json();
          const active = (data as Array<{ isActive: boolean; message: string }>).find((a) => a.isActive);
          if (active) {
            setAnnouncement(active.message);
          }
        }
      } catch (err) {
        console.error("Announcement fetch failed:", err);
      }
    }
    fetchAnnouncement();
  }, []);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = items.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);

  // Auth modal variables
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authView, setAuthView] = useState<"signin" | "signup" | "admin">("signin");
  const [phone, setPhone] = useState("+91");
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  // Real-time search variables
  const [searchResults, setSearchResults] = useState<{
    guides: { id: string; title: string; slug: string; category: string }[];
    kits: { id: string; name: string; occ: string; deity: string; price: number; itemsCount: string }[];
  }>({ guides: [], kits: [] });

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ guides: [], kits: [] });
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch(`/api/public/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch (err) {
        console.error("Search fetch failed:", err);
      }
    }, 150);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const triggerToast = (msg: string) => {
    if (onTriggerToast) {
      onTriggerToast(msg);
    } else {
      alert(msg);
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);

    const indiaPhoneRegex = /^\+91[6-9]\d{9}$/;
    if (!indiaPhoneRegex.test(phone)) {
      setLoginError("Invalid format. Must be India E.164 (+91XXXXXXXXXX).");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.error || "Failed to dispatch verification code.");
      } else {
        setOtpRequested(true);
        triggerToast("Verification code dispatched!");
      }
    } catch {
      setLoginError("Network connection error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);

    if (otp.length !== 6) {
      setLoginError("Verification code must be exactly 6 digits.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          otp,
          ...(authView === "signup" ? { name, email } : {}),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.error || "Verification failed.");
      } else {
        setSession({ user: data.user });
        setIsLoginModalOpen(false);
        setPhone("+91");
        setOtp("");
        setName("");
        setEmail("");
        setOtpRequested(false);
        triggerToast("Logged in successfully!");
        router.refresh();
      }
    } catch {
      setLoginError("Network connection error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);

    if (!adminEmail.includes("@")) {
      setLoginError("Invalid email format.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      });
      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.error || "Invalid email or password.");
      } else {
        setSession({ user: data.user });
        setIsLoginModalOpen(false);
        setAdminEmail("");
        setAdminPassword("");
        triggerToast("Logged in as Admin. Redirecting...");
        router.push("/admin");
      }
    } catch {
      setLoginError("Network connection error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (response.ok) {
        setSession(null);
        setIsAcctOpen(false);
        triggerToast("Logged out successfully.");
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleTabClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
    if (tabId === "rg") router.push("/ritual-guides");
    else if (tabId === "pa") router.push("/panchang");
    else if (tabId === "dc") router.push("/dharmic-concepts");
    else if (tabId === "rk") router.push("/ritual-kits");
  };

  // Close overlays on clicking outside
  const headerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveDd(null);
        setIsSearchOpen(false);
        setIsCartOpen(false);
        setIsAcctOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={headerRef} className="w-full relative z-[150] select-none font-sans">
      {/* Scope CSS styling block directly from Header.html */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root{
          --bg:#F2EDE4; --card:#FFFFFF; --dark:#1C1712; --darkbar:#1A1208;
          --pink:#FD066D; --amber:#E8A020; --gold:#A07800; --yellow:#EDAB3A;
          --body-text:#2C2010; --mid-text:#5C4B12; --sub-text:#8A7A68;
          --border:#E8E0D0; --border-light:#F0E8D8;
          --hero-text:#FFFDF5; --dim:#7A6A55;
          --d-bg:#E6F1E6; --d-tx:#27500A; --d-bd:#C9DFC9;
          --p-bg:#FFF8E6; --p-tx:#A07800; --p-bd:#EFE0B8;
          --b-bg:#F0E9E1; --b-tx:#4A3525; --b-bd:#D9CBB8;
          --data-bg:#EEF3F7; --data-tx:#1F4460; --data-bd:#C3D6E4;
        }

        /* ── HEADER LAYOUTS ── */
        .announce{background:var(--dark);padding:7px 28px;display:flex;align-items:center;justify-content:space-between}
        .ann-text{font-size:10px;color:#E3B567}
        .ann-text strong{color:var(--pink);font-weight:600}
        .ann-links{display:flex;gap:20px}
        .ann-link{font-size:10px;color:var(--sub-text);cursor:pointer;}
        .ann-link:hover{color:var(--pink)}

        .nav{background:var(--card);border-bottom:1px solid var(--border);position:relative}
        .nav-in{padding:0 28px;display:flex;align-items:center;height:72px}
        
        .burger{display:none;width:36px;height:36px;border:none;background:none;flex-direction:column;gap:4.5px;padding:0 7px;justify-content:center;cursor:pointer}
        .burger span{height:2px;background:var(--dark);border-radius:2px;display:block;width:100%}
        .burger span:nth-child(2){width:68%}

        .logo{display:flex;align-items:center;gap:11px;margin-right:30px;flex-shrink:0;cursor:pointer}
        .logo img{height:52px;width:auto;display:block}
        .logo-wm{font-size:10px;color:var(--pink);font-weight:600;letter-spacing:.3px;line-height:1.25;max-width:76px;text-align:left}

        .cats{display:flex;flex:1}
        .cat{font-size:15px;font-weight:500;color:var(--sub-text);padding:0 14px;height:72px;display:flex;align-items:center;gap:6px;border:none;border-bottom:3px solid transparent;background:none;white-space:nowrap;position:relative;cursor:pointer;transition:all 0.15s;}
        .cat .car{font-size:9px;opacity:.6;transition:transform .18s}
        .cat.on,.cat:hover{color:var(--pink);border-bottom-color:var(--pink);font-weight:600}
        .cat.on .car{transform:rotate(180deg)}
        .cat .new{font-size:8.5px;font-weight:700;background:var(--pink);color:#fff;border-radius:4px;padding:2px 6px;letter-spacing:.4px}

        .right{display:flex;align-items:center;gap:9px;margin-left:auto}
        .srch{display:flex;align-items:center;gap:9px;background:var(--bg);border:1px solid var(--border);border-radius:22px;padding:10px 16px;font-size:13.5px;color:var(--sub-text);width:190px;cursor:pointer}
        .lang{display:flex;gap:2px;background:var(--bg);border-radius:8px;padding:3px}
        .lang button{border:none;border-radius:6px;padding:6px 11px;font-size:12px;font-weight:700;background:none;color:var(--pink);cursor:pointer}
        .lang button.on{background:var(--pink);color:#fff}
        
        .ico{width:40px;height:40px;border:1.5px solid var(--border);border-radius:10px;background:var(--bg);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;position:relative;cursor:pointer}
        .ico .badge{position:absolute;top:-5px;right:-5px;min-width:18px;height:18px;border-radius:9px;background:var(--pink);color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;padding:0 5px}

        .signin{background:none;border:1.5px solid var(--border);border-radius:10px;padding:10px 17px;font-size:13.5px;font-weight:600;color:var(--body-text);white-space:nowrap;cursor:pointer}
        .signup{background:var(--pink);border:none;border-radius:10px;padding:11px 19px;font-size:13.5px;font-weight:700;color:#fff;white-space:nowrap;cursor:pointer}

        /* ── DROPDOWN ── */
        .dd{position:absolute;left:0;right:0;top:100%;background:var(--card);border-top:1px solid var(--border);border-bottom:1px solid var(--border);box-shadow:0 14px 34px rgba(28,23,18,.13);z-index:120;display:none}
        .dd.open{display:block}
        .dd-in{padding:26px 28px 22px;display:grid;grid-template-columns:1.05fr 1fr 1fr 1.15fr;gap:30px;text-align:left}
        .col-h{font-size:9.5px;font-weight:700;color:var(--gold);letter-spacing:.7px;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid var(--border-light)}
        .dl{display:block;padding:7px 0;font-size:14px;color:var(--body-text);text-align:left}
        .dl:hover{color:var(--pink)}
        .dl b{display:block;font-weight:600}
        .dl small{display:block;font-size:11.5px;color:var(--sub-text);margin-top:1px;line-height:1.5}
        .dl.lead{background:#FFF0F5;border:1px solid #F7C0D6;border-radius:11px;padding:12px 14px;margin-bottom:8px}
        .dl.lead b{color:var(--pink)}
        .dd-foot{border-top:1px solid var(--border-light);background:#FCFAF6;padding:12px 28px;font-size:12.5px;color:var(--sub-text);display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;text-align:left}
        .dd-foot b{color:var(--body-text);font-weight:600}
        .dd-foot a{color:var(--pink);font-weight:700}
        .feat{background:var(--darkbar);border-radius:13px;padding:18px 20px;display:flex;flex-direction:column;text-align:left}

        /* ── SEARCH OVERLAY ── */
        .so{position:absolute;left:0;right:0;top:100%;background:var(--card);border-bottom:1px solid var(--border);box-shadow:0 14px 34px rgba(28,23,18,.13);z-index:130;padding:22px 28px 24px;text-align:left}
        .so-f{display:flex;align-items:center;gap:12px;background:var(--bg);border:1.5px solid var(--pink);border-radius:13px;padding:14px 18px;margin-bottom:18px}
        .so-f input{flex:1;background:none;border:none;outline:none;font-size:16px;color:var(--dark);font-family:inherit}
        .so-esc{font-size:11px;color:var(--sub-text);border:1px solid var(--border);border-radius:6px;padding:4px 9px;cursor:pointer}
        .so-g{display:grid;grid-template-columns:1fr 1fr 1fr;gap:26px}
        .so-h{font-size:9.5px;font-weight:700;color:var(--gold);letter-spacing:.6px;margin-bottom:10px}
        .so-i{display:block;padding:6px 0;font-size:13.5px;color:var(--body-text);cursor:pointer}
        .so-i:hover{color:var(--pink)}
        .so-i span{color:var(--sub-text);font-size:11.5px;margin-left:6px}
        .so-chip{display:inline-block;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:6px 12px;font-size:12.5px;margin:0 6px 6px 0;color:var(--body-text);cursor:pointer}
        .so-chip:hover{border-color:var(--pink);color:var(--pink)}

        /* ── ACCOUNT MENU ── */
        .acct{position:absolute;right:28px;top:100%;width:280px;background:var(--card);border:1px solid var(--border);border-radius:14px;box-shadow:0 14px 34px rgba(28,23,18,.16);z-index:130;overflow:hidden;text-align:left}
        .acct-h{padding:15px 18px;border-bottom:1px solid var(--border-light);background:#FCFAF6}
        .acct-n{font-size:15px;font-weight:700;color:var(--dark)}
        .acct-e{font-size:12px;color:var(--sub-text);margin-top:2px}
        .acct-i{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 18px;font-size:13.5px;border-bottom:.5px solid var(--border-light);cursor:pointer}
        .acct-i:hover{background:var(--bg)}
        .acct-i .n{font-size:10px;font-weight:700;background:var(--p-bg);color:var(--p-tx);border:1px solid var(--p-bd);border-radius:5px;padding:2px 7px}
        .acct-o{padding:11px 18px;font-size:13.5px;color:var(--sub-text);cursor:pointer;display:block}
        .acct-o:hover{color:var(--pink);background:var(--bg)}

        /* ── MINI CART ── */
        .cart{position:absolute;right:28px;top:100%;width:340px;background:var(--card);border:1px solid var(--border);border-radius:14px;box-shadow:0 14px 34px rgba(28,23,18,.16);z-index:130;overflow:hidden;text-align:left}
        .cart-h{padding:14px 18px;border-bottom:1px solid var(--border-light);display:flex;justify-content:space-between;align-items:baseline}
        .cart-t{font-size:14px;font-weight:700;color:var(--dark)}
        .cart-c{font-size:12px;color:var(--sub-text)}
        .cart-i{display:flex;gap:12px;padding:13px 18px;border-bottom:.5px solid var(--border-light)}
        .cart-th{width:46px;height:46px;border-radius:9px;flex-shrink:0}
        .cart-n{font-size:13.5px;font-weight:600;color:var(--dark);line-height:1.3}
        .cart-m{font-size:11.5px;color:var(--amber);font-weight:700;margin-top:3px}
        .cart-p{font-size:13.5px;font-weight:700;color:var(--dark);margin-left:auto;white-space:nowrap}
        .cart-f{padding:14px 18px;background:#FCFAF6}
        .cart-row{display:flex;justify-content:space-between;font-size:13.5px;margin-bottom:11px}
        .cart-row b{font-weight:700;color:var(--dark)}
        .cart-b{width:100%;background:var(--pink);border:none;border-radius:11px;padding:12px;font-size:13.5px;font-weight:700;color:#fff;cursor:pointer}
        .cart-note{font-size:11.5px;color:var(--sub-text);line-height:1.6;margin-top:10px;text-align:center}

        /* ── MOBILE DRAWER ── */
        .mob{position:fixed;top:0;bottom:0;right:0;width:100%;max-width:390px;background:var(--card);box-shadow:-4px 0 24px rgba(0,0,0,0.15);z-index:200;overflow-y:auto;display:flex;flex-direction:column;text-align:left}
        .mob-top{display:flex;align-items:center;height:70px;padding:0 12px;gap:10px;border-bottom:1px solid var(--border)}
        .mob-close{width:38px;height:38px;border:1.5px solid var(--border);border-radius:10px;background:var(--bg);display:flex;align-items:center;justify-content:center;font-size:17px;cursor:pointer}
        .mob-srch{margin:14px 16px;display:flex;align-items:center;gap:10px;background:var(--bg);border:1.5px solid var(--border);border-radius:12px;padding:12px 15px;font-size:14px;color:var(--sub-text);cursor:pointer}
        .mob-acc{border-top:1px solid var(--border-light)}
        .mob-a{padding:15px 16px;display:flex;align-items:center;justify-content:space-between;font-size:16px;font-weight:700;color:var(--dark);border-bottom:1px solid var(--border-light);cursor:pointer}
        .mob-a .car{font-size:12px;color:var(--sub-text)}
        .mob-sub{background:var(--bg);padding:4px 16px 12px;border-bottom:1px solid var(--border-light)}
        .mob-s{display:block;padding:10px 0;font-size:14.5px;color:var(--body-text);border-bottom:.5px solid var(--border)}
        .mob-s:last-child{border-bottom:none}
        .mob-s.lead{color:var(--pink);font-weight:700}
        .mob-util{padding:14px 16px;display:flex;flex-direction:column;gap:2px;border-bottom:1px solid var(--border-light)}
        .mob-u{padding:9px 0;font-size:14px;color:var(--sub-text);cursor:pointer}
        .mob-u:hover{color:var(--pink)}
        .mob-cta{padding:16px}
        .mob-b{width:100%;border:none;border-radius:12px;padding:14px;font-size:14.5px;font-weight:700;margin-bottom:9px;cursor:pointer}
        .mob-b.pink{background:var(--pink);color:#fff}
        .mob-b.wa{background:#1F9D52;color:#fff;display:flex;align-items:center;justify-content:center;gap:9px}
        .mob-b.ghost{background:none;border:1.5px solid var(--border);color:var(--body-text)}
        .mob-lang{display:flex;gap:8px;padding:0 16px 18px}
        .mob-lang button{flex:1;border:1.5px solid var(--border);border-radius:10px;padding:11px;font-size:14px;font-weight:700;background:none;color:var(--body-text);cursor:pointer}
        .mob-lang button.on{background:var(--pink);border-color:var(--pink);color:#fff}

        /* Responsive overrides */
        @media (max-width:900px){
          .burger{display:flex}
          .cats, .right .srch, .right .lang, .right .signin, .right .signup{display:none}
        }
      ` }} />

      {/* 1. Announcement bar */}
      <div className="announce">
        <p className="ann-text" dangerouslySetInnerHTML={{ __html: `<strong>Announcements:</strong> ${announcement}` }} />
      </div>

      {/* 2. Global Navbar */}
      <nav className="nav">
        <div className="nav-in">
          {/* Mobile burger toggle */}
          <button onClick={() => setIsMobileOpen(true)} className="burger">
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Wordmark logo */}
          <div onClick={() => router.push("/")} className="logo">
            <img src={LOGO} alt="तप्" />
            <span className="logo-wm">the tapa company</span>
          </div>

          {/* Navigation Category Tabs (Desktop) */}
          <div className="cats">
            <button
              onMouseEnter={() => { setActiveDd("rg"); setIsSearchOpen(false); setIsCartOpen(false); setIsAcctOpen(false); }}
              onClick={() => handleTabClick("rg")}
              className={`cat ${activeDd === "rg" ? "on" : ""}`}
            >
              Ritual Guides <span className="car">▾</span>
            </button>
            <button
              onMouseEnter={() => { setActiveDd("pa"); setIsSearchOpen(false); setIsCartOpen(false); setIsAcctOpen(false); }}
              onClick={() => handleTabClick("pa")}
              className={`cat ${activeDd === "pa" ? "on" : ""}`}
            >
              Panchang <span className="car">▾</span>
            </button>
            <button
              onMouseEnter={() => { setActiveDd("dc"); setIsSearchOpen(false); setIsCartOpen(false); setIsAcctOpen(false); }}
              onClick={() => handleTabClick("dc")}
              className={`cat ${activeDd === "dc" ? "on" : ""}`}
            >
              Dharmic Concepts <span className="car">▾</span>
            </button>
            <button
              onMouseEnter={() => { setActiveDd("rk"); setIsSearchOpen(false); setIsCartOpen(false); setIsAcctOpen(false); }}
              onClick={() => handleTabClick("rk")}
              className={`cat ${activeDd === "rk" ? "on" : ""}`}
            >
              Ritual Kits <span className="new">NEW</span><span className="car">▾</span>
            </button>
          </div>

          {/* Right Actions */}
          <div className="right">
            {/* Search Input click trigger */}
            <div onClick={() => { setIsSearchOpen(true); setActiveDd(null); setIsCartOpen(false); setIsAcctOpen(false); }} className="srch">
              <span>⌕</span>
              <span>Search rituals, kits…</span>
            </div>

            {/* Language toggle selector */}
            <div className="lang">
              <button className="on">EN</button>
              <button onClick={() => triggerToast("Hindi translation in progress")}>हिं</button>
            </div>

            {/* Wishlist icon link */}
            <div onClick={() => router.push("/wishlist")} className="ico" title="Wishlist">
              ♡
            </div>

            {/* Cart Icon dropdown drawer trigger */}
            <div onClick={() => { setIsCartOpen(!isCartOpen); setIsSearchOpen(false); setActiveDd(null); setIsAcctOpen(false); }} className="ico" title="Cart">
              🛒
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </div>

            {/* User Session control */}
            {session ? (
              <div
                onClick={() => { setIsAcctOpen(!isAcctOpen); setIsCartOpen(false); setIsSearchOpen(false); setActiveDd(null); }}
                className="ico font-bold text-sm bg-[#FAF0E6] text-pink border border-[#FAD2DA]"
                title="Account Settings"
              >
                👤
              </div>
            ) : (
              <>
                <button onClick={() => { setAuthView("signin"); setLoginError(""); setIsLoginModalOpen(true); }} className="signin">Sign in</button>
                <button onClick={() => { setAuthView("signup"); setLoginError(""); setIsLoginModalOpen(true); }} className="signup">Sign up</button>
              </>
            )}
          </div>
        </div>

        {/* ── 3. CATEGORIES DROPDOWNS OVERLAYS ── */}
        {activeDd && (
          <div
            onMouseLeave={() => setActiveDd(null)}
            className="dd open"
            dangerouslySetInnerHTML={{ __html: DD[activeDd] }}
          />
        )}

        {/* ── 4. SEARCH OVERLAY PANEL ── */}
        {isSearchOpen && (
          <div className="so">
            <div className="so-f">
              <span style={{ fontSize: "17px", color: "var(--sub-text)" }}>⌕</span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rituals, festivals, concepts…"
                autoFocus
              />
              <span onClick={() => setIsSearchOpen(false)} className="so-esc">ESC</span>
            </div>
            
            <div className="so-g">
              <div>
                <div className="so-h">RITUAL GUIDES</div>
                {searchQuery.trim() && searchResults.guides.length > 0 ? (
                  searchResults.guides.map((item) => (
                    <a
                      key={item.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                        router.push(`/ritual-guides/${item.slug}`);
                      }}
                      className="so-i"
                    >
                      {item.title} <span>{item.category}</span>
                    </a>
                  ))
                ) : searchQuery.trim() ? (
                  <p className="text-xs text-[#8A7A6E] italic py-2">No matching guides found</p>
                ) : (
                  <>
                    <a href="/ritual-guides" className="so-i">Today&apos;s Panchang Vrat</a>
                    <a href="/ritual-guides" className="so-i">Ganesh Puja Sthapana</a>
                  </>
                )}
              </div>
              
              <div>
                <div className="so-h">RITUAL SAMAGRI KITS</div>
                {searchQuery.trim() && searchResults.kits.length > 0 ? (
                  searchResults.kits.map((item) => (
                    <a
                      key={item.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                        router.push(`/ritual-kits/${item.id}`);
                      }}
                      className="so-i"
                    >
                      {item.name} <span>₹{item.price}</span>
                    </a>
                  ))
                ) : searchQuery.trim() ? (
                  <p className="text-xs text-[#8A7A6E] italic py-2">No matching kits found</p>
                ) : (
                  <>
                    <a href="/ritual-kits" className="so-i">Shiva Puja Kit</a>
                    <a href="/ritual-kits" className="so-i">Hartalika Teej Kit</a>
                  </>
                )}
              </div>
              
              <div>
                <div className="so-h">POPULAR SEARCHES</div>
                <span onClick={() => setSearchQuery("Ganesh")} className="so-chip">Ganesh Chaturthi</span>
                <span onClick={() => setSearchQuery("Rahu")} className="so-chip">Rahu Kaal</span>
                <span onClick={() => setSearchQuery("Teej")} className="so-chip">Teej Vrat</span>
                <span onClick={() => setSearchQuery("Eclipse")} className="so-chip">Sutak timing</span>
              </div>
            </div>
          </div>
        )}

        {/* ── 5. MINI CART DROPDOWN PANEL ── */}
        {isCartOpen && (
          <div className="cart">
            <div className="cart-h">
              <span className="cart-t">Your cart</span>
              <span className="cart-c">{cartCount} items</span>
            </div>
            
            {items.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#8A7A6E] italic">
                Your e-commerce cart is empty.
              </div>
            ) : (
              <div className="max-h-72 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.productId} className="cart-i">
                    <div className="cart-th" style={{ background: "linear-gradient(150deg,#6B3410,#B5651D)" }}></div>
                    <div>
                      <div className="cart-n">{item.name} (x{item.quantity})</div>
                      <div className="cart-m">{item.category || "Ritual Kit"}</div>
                    </div>
                    <div className="cart-p">₹{(Number(item.price) * item.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="cart-f">
              <div className="cart-row">
                <span>Subtotal</span>
                <b>₹{cartSubtotal.toLocaleString()}</b>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  router.push("/checkout");
                }}
                disabled={items.length === 0}
                className="cart-b"
              >
                Checkout ›
              </button>
              <p className="cart-note">Dated kits are prepaid. Free cancellation until dispatch.</p>
            </div>
          </div>
        )}

        {/* ── 6. ACCOUNT MENU DROPDOWN PANEL ── */}
        {isAcctOpen && session && (
          <div className="acct">
            <div className="acct-h">
              <div className="acct-n">{session.user.name || "Tapa Practitioner"}</div>
              <div className="acct-e">{session.user.email || session.user.phone}</div>
            </div>
            <Link href="/account" onClick={() => setIsAcctOpen(false)} className="acct-i">
              <span>My Saved Rituals</span>
              <span className="n">Active</span>
            </Link>
            <Link href="/account" onClick={() => setIsAcctOpen(false)} className="acct-i">
              <span>My Booking Histories</span>
              <span className="n">Gate 3</span>
            </Link>
            <Link href="/account" onClick={() => setIsAcctOpen(false)} className="acct-i">
              <span>E-Commerce Orders Placed</span>
            </Link>
            {session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN" ? (
              <Link href="/admin" onClick={() => setIsAcctOpen(false)} className="acct-i font-semibold text-[#1D8A56]">
                <span>🛡️ Admin Command CMS</span>
              </Link>
            ) : null}
            <a onClick={handleLogout} className="acct-o">Sign out</a>
          </div>
        )}

        {/* ── 7. MOBILE OVERLAY SIDE DRAWER ── */}
        {isMobileOpen && (
          <div className="mob">
            <div className="mob-top">
              <div onClick={() => { setIsMobileOpen(false); router.push("/"); }} className="logo">
                <img src={LOGO} alt="तप्" />
                <span className="logo-wm">the tapa company</span>
              </div>
              <button onClick={() => setIsMobileOpen(false)} className="mob-close" style={{ marginLeft: "auto" }}>✕</button>
            </div>
            
            <div
              onClick={() => {
                setIsMobileOpen(false);
                setIsSearchOpen(true);
              }}
              className="mob-srch"
            >
              <span>⌕</span>
              <span>Search rituals, festivals…</span>
            </div>
            
            <div className="mob-acc">
              {/* Ritual Guides Accordion */}
              <div>
                <div onClick={() => setMobileAccordion(mobileAccordion === "rg" ? null : "rg")} className="mob-a">
                  Ritual Guides <span className="car">{mobileAccordion === "rg" ? "▴" : "▾"}</span>
                </div>
                {mobileAccordion === "rg" && (
                  <div className="mob-sub">
                    <Link href="/ritual-guides" onClick={() => setIsMobileOpen(false)} className="mob-s lead">Beginner&apos;s Guides</Link>
                    <Link href="/ritual-guides" onClick={() => setIsMobileOpen(false)} className="mob-s">Festive Pujans</Link>
                    <Link href="/ritual-guides" onClick={() => setIsMobileOpen(false)} className="mob-s">All-Year Pujans</Link>
                    <Link href="/ritual-guides" onClick={() => setIsMobileOpen(false)} className="mob-s" style={{ color: "var(--pink)", fontWeight: "700" }}>All Ritual Guides ›</Link>
                  </div>
                )}
              </div>

              {/* Panchang Accordion */}
              <div>
                <div onClick={() => setMobileAccordion(mobileAccordion === "pa" ? null : "pa")} className="mob-a">
                  Panchang <span className="car">{mobileAccordion === "pa" ? "▴" : "▾"}</span>
                </div>
                {mobileAccordion === "pa" && (
                  <div className="mob-sub">
                    <Link href="/panchang" onClick={() => setIsMobileOpen(false)} className="mob-s">Today&apos;s Panchang</Link>
                    <Link href="/panchang/eclipse" onClick={() => setIsMobileOpen(false)} className="mob-s">Eclipse Visibility</Link>
                  </div>
                )}
              </div>

              {/* Dharmic Concepts Accordion */}
              <div>
                <div onClick={() => setMobileAccordion(mobileAccordion === "dc" ? null : "dc")} className="mob-a">
                  Dharmic Concepts <span className="car">{mobileAccordion === "dc" ? "▴" : "▾"}</span>
                </div>
                {mobileAccordion === "dc" && (
                  <div className="mob-sub">
                    <Link href="/dharmic-concepts" onClick={() => setIsMobileOpen(false)} className="mob-s">Glossary Library</Link>
                    <Link href="/dharmic-concepts/bilva" onClick={() => setIsMobileOpen(false)} className="mob-s">Bilva Leaf Offering</Link>
                  </div>
                )}
              </div>

              {/* Ritual Kits Accordion */}
              <div>
                <div onClick={() => setMobileAccordion(mobileAccordion === "rk" ? null : "rk")} className="mob-a">
                  Ritual Kits <span className="car">{mobileAccordion === "rk" ? "▴" : "▾"}</span>
                </div>
                {mobileAccordion === "rk" && (
                  <div className="mob-sub">
                    <Link href="/ritual-kits" onClick={() => setIsMobileOpen(false)} className="mob-s">All Samagri Kits</Link>
                    <Link href="/cart" onClick={() => setIsMobileOpen(false)} className="mob-s">View Cart ({cartCount})</Link>
                  </div>
                )}
              </div>
            </div>

            <div className="mob-util">
              <Link href="/dharmic-concepts" onClick={() => setIsMobileOpen(false)} className="mob-u">Glossary</Link>
              <Link href="/admin/sources" onClick={() => setIsMobileOpen(false)} className="mob-u">Scripture References</Link>
              <a onClick={() => { setIsMobileOpen(false); triggerToast("Every claim scored to named texts."); }} className="mob-u">Our Editorial Method</a>
            </div>

            <div className="mob-cta">
              <button onClick={() => { setIsMobileOpen(false); router.push("/tapa-circle"); }} className="mob-b wa">
                Join the Tapa Circle · ₹499/yr
              </button>
              {!session ? (
                <>
                  <button onClick={() => { setIsMobileOpen(false); setAuthView("signup"); setIsLoginModalOpen(true); }} className="mob-b pink">Create account</button>
                  <button onClick={() => { setIsMobileOpen(false); setAuthView("signin"); setIsLoginModalOpen(true); }} className="mob-b ghost">Sign in</button>
                </>
              ) : (
                <button onClick={() => { setIsMobileOpen(false); handleLogout(); }} className="mob-b ghost text-red-600">Sign Out</button>
              )}
            </div>
            
            <div className="mob-lang">
              <button className="on">English</button>
              <button onClick={() => triggerToast("Hindi in progress")}>हिंदी</button>
            </div>
          </div>
        )}
      </nav>

      {/* ── 8. AUTH MODAL OVERLAY (OTP / Admin creds login) ── */}
      {isLoginModalOpen && (
        <div className="modal-overlay fixed inset-0 z-[250] bg-black/40 flex items-center justify-center" onClick={() => setIsLoginModalOpen(false)}>
          <div className="modal-card bg-white border border-[#EADFC9] rounded-2xl p-6 md:p-8 max-w-sm w-full mx-4 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close absolute top-4 right-4 text-lg font-bold text-sub-text hover:text-pink" onClick={() => setIsLoginModalOpen(false)}>✕</button>

            <div className="modal-header mb-6">
              <h2 className="modal-title font-serif font-bold text-xl text-dark">
                {authView === "admin"
                  ? "Super Admin Portal"
                  : authView === "signup"
                    ? "Create Account"
                    : "Welcome to The Tapa Co."}
              </h2>
              <p className="modal-sub text-xs text-[#8A7A6E] mt-1.5 leading-relaxed">
                {authView === "admin"
                  ? "Access administrative parameters and configuration logs."
                  : "Dharma doesn't demand fear — it demands pure devotion."}
              </p>
            </div>

            {loginError && (
              <div className="modal-error bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3 mb-4 font-medium">
                {loginError}
              </div>
            )}

            {/* OTP VERIFICATION VIEW */}
            {otpRequested ? (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-[#6A5A4E]">Verification Code (OTP)</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-pink text-dark"
                    disabled={loading}
                    required
                    autoFocus
                  />
                </div>

                <button type="submit" className="w-full bg-[#FD066D] hover:bg-[#E0045B] text-white font-bold py-2.5 rounded-xl text-sm transition-colors cursor-pointer" disabled={loading}>
                  {loading ? "Verifying..." : "Verify & Sign In"}
                </button>

                <button
                  type="button"
                  onClick={() => setOtpRequested(false)}
                  className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-dark font-semibold py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
                  disabled={loading}
                >
                  ← Change Details
                </button>
              </form>
            ) : (
              /* VIEW SELECTION */
              <>
                {/* 1. SIGN IN VIEW */}
                {authView === "signin" && (
                  <form onSubmit={handleRequestOtp} className="space-y-4 text-left">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#6A5A4E]">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+91XXXXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-pink text-dark"
                        disabled={loading}
                        required
                      />
                    </div>

                    <button type="submit" className="w-full bg-[#FD066D] hover:bg-[#E0045B] text-white font-bold py-2.5 rounded-xl text-sm transition-colors cursor-pointer" disabled={loading}>
                      {loading ? "Sending..." : "Request Verification Code"}
                    </button>

                    <div className="text-center text-xs mt-2">
                      <span className="text-sub-text">Don&apos;t have an account? </span>
                      <button
                        type="button"
                        onClick={() => { setAuthView("signup"); setLoginError(""); }}
                        className="text-pink font-bold hover:underline bg-transparent border-none cursor-pointer"
                      >
                        Sign Up
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-sub-text text-[10px] uppercase font-bold tracking-wider my-3.5">
                      <span className="h-[1px] bg-gray-200 flex-1"></span>
                      <span className="px-3">or</span>
                      <span className="h-[1px] bg-gray-200 flex-1"></span>
                    </div>

                    <button
                      type="button"
                      className="w-full border border-gray-300 hover:bg-gray-50 text-dark text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                      onClick={() => {
                        setLoading(true);
                        triggerToast("Redirecting to Google...");
                        nextAuthSignIn("google", { callbackUrl: "/" });
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21.35,11.1H12v2.7h5.38C16.88,15.22,14.77,16.5,12,16.5c-3.03,0-5.61-2.08-6.53-4.88c-0.24-0.73-0.38-1.5-0.38-2.3 s0.14-1.57,0.38-2.3c0.92-2.8,3.5-4.88,6.53-4.88c1.64,0,3.12,0.6,4.28,1.71l2.02-2.02C16.51,2.02,14.41,1,12,1 C7.03,1,3,5.03,3,10s4.03,9,9,9c4.97,0,9-4.03,9-9C21,11.1,21,11.1,21.35,11.1z" fill="#EA4335" />
                      </svg>
                      <span>Continue with Google</span>
                    </button>

                    <div className="h-[1px] bg-gray-100 my-4" />

                    <button
                      type="button"
                      onClick={() => { setAuthView("admin"); setLoginError(""); }}
                      className="w-full text-xs font-semibold bg-gray-50 border border-gray-200 py-2 rounded-xl text-sub-text hover:text-dark cursor-pointer text-center"
                    >
                      🔒 Super Admin Portal
                    </button>
                  </form>
                )}

                {/* 2. SIGN UP VIEW */}
                {authView === "signup" && (
                  <form onSubmit={handleRequestOtp} className="space-y-4 text-left">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#6A5A4E]">Full Name</label>
                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-pink text-dark"
                        disabled={loading}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#6A5A4E]">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+91XXXXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-pink text-dark"
                        disabled={loading}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#6A5A4E]">Email Address (Optional)</label>
                      <input
                        type="email"
                        placeholder="yourname@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-pink text-dark"
                        disabled={loading}
                      />
                    </div>

                    <button type="submit" className="w-full bg-[#FD066D] hover:bg-[#E0045B] text-white font-bold py-2.5 rounded-xl text-sm transition-colors cursor-pointer" disabled={loading}>
                      {loading ? "Sending..." : "Create Account & Verify"}
                    </button>

                    <div className="text-center text-xs mt-2">
                      <span className="text-sub-text">Already have an account? </span>
                      <button
                        type="button"
                        onClick={() => { setAuthView("signin"); setLoginError(""); }}
                        className="text-pink font-bold hover:underline bg-transparent border-none cursor-pointer"
                      >
                        Sign In
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-sub-text text-[10px] uppercase font-bold tracking-wider my-3.5">
                      <span className="h-[1px] bg-gray-200 flex-1"></span>
                      <span className="px-3">or</span>
                      <span className="h-[1px] bg-gray-200 flex-1"></span>
                    </div>

                    <button
                      type="button"
                      className="w-full border border-gray-300 hover:bg-gray-50 text-dark text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                      onClick={() => {
                        setLoading(true);
                        triggerToast("Redirecting to Google...");
                        nextAuthSignIn("google", { callbackUrl: "/" });
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21.35,11.1H12v2.7h5.38C16.88,15.22,14.77,16.5,12,16.5c-3.03,0-5.61-2.08-6.53-4.88c-0.24-0.73-0.38-1.5-0.38-2.3 s0.14-1.57,0.38-2.3c0.92-2.8,3.5-4.88,6.53-4.88c1.64,0,3.12,0.6,4.28,1.71l2.02-2.02C16.51,2.02,14.41,1,12,1 C7.03,1,3,5.03,3,10s4.03,9,9,9c4.97,0,9-4.03,9-9C21,11.1,21,11.1,21.35,11.1z" fill="#EA4335" />
                      </svg>
                      <span>Continue with Google</span>
                    </button>
                  </form>
                )}

                {/* 3. ADMIN LOGIN VIEW */}
                {authView === "admin" && (
                  <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#6A5A4E]">Email Address</label>
                      <input
                        type="email"
                        placeholder="admin@tapa.co"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-pink text-dark"
                        disabled={loading}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#6A5A4E]">Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-pink text-dark"
                        disabled={loading}
                        required
                      />
                    </div>

                    <button type="submit" className="w-full bg-[#FD066D] hover:bg-[#E0045B] text-white font-bold py-2.5 rounded-xl text-sm transition-colors cursor-pointer" disabled={loading}>
                      {loading ? "Authenticating..." : "Admin Access Verify"}
                    </button>

                    <button
                      type="button"
                      onClick={() => { setAuthView("signin"); setLoginError(""); }}
                      className="w-full text-xs font-semibold bg-transparent text-pink hover:underline text-center cursor-pointer"
                    >
                      ← Back to Customer Login
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
